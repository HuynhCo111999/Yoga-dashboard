import { BaseApiService } from './base';
import type { ApiResponse } from './types';
import type { WhereFilterOp } from 'firebase/firestore';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  isPublished: boolean;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostCreateRequest {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  featuredImage?: string;
}

export interface BlogPostUpdateRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
  featuredImage?: string;
  publishedAt?: string;
}

export interface BlogPostFilters {
  isPublished?: boolean;
  author?: string;
  tags?: string[];
}

class BlogApiService extends BaseApiService {
  constructor() {
    super('blog_posts');
  }

  // Generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 100); // Limit length
  }

  // Ensure unique slug
  private async ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await this.getAll<BlogPost>({
        filters: [{ field: 'slug', operator: '==', value: slug }]
      });
      
      if (existing.success && existing.data) {
        const existingPost = existing.data.find(post => post.id !== excludeId);
        if (!existingPost) {
          return slug;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
      } else {
        return slug;
      }
    }
  }

  async getAllPosts(filters?: BlogPostFilters): Promise<ApiResponse<BlogPost[]>> {
    try {
      const queryFilters: Array<{
        field: string;
        operator: WhereFilterOp;
        value: unknown;
      }> = [];

      if (filters?.isPublished !== undefined) {
        queryFilters.push({
          field: 'isPublished',
          operator: '==',
          value: filters.isPublished,
        });
      }

      if (filters?.author) {
        queryFilters.push({
          field: 'author',
          operator: '==',
          value: filters.author,
        });
      }

      const result = await this.getAll<BlogPost>({
        filters: queryFilters,
        orderByField: 'publishedAt',
        orderDirection: 'desc'
      });

      return result;
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getPublishedPosts(): Promise<ApiResponse<BlogPost[]>> {
    return this.getAllPosts({ isPublished: true });
  }

  async getPostById(id: string): Promise<ApiResponse<BlogPost>> {
    try {
      const result = await this.getById(id);
      if (result.success && result.data) {
        return {
          data: result.data as BlogPost,
          error: null,
          success: true,
        };
      } else {
        return {
          data: null,
          error: result.error || 'Không tìm thấy bài viết',
          success: false,
        };
      }
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    try {
      const result = await this.getAll<BlogPost>({
        filters: [{ field: 'slug', operator: '==', value: slug }]
      });

      if (result.success && result.data && result.data.length > 0) {
        return {
          data: result.data[0],
          error: null,
          success: true,
        };
      } else {
        return {
          data: null,
          error: 'Không tìm thấy bài viết',
          success: false,
        };
      }
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async createPost(data: BlogPostCreateRequest): Promise<ApiResponse<BlogPost>> {
    try {
      // Generate unique slug
      const baseSlug = this.generateSlug(data.title);
      const slug = await this.ensureUniqueSlug(baseSlug);
      
      const postData = {
        ...data,
        slug,
        publishedAt: data.isPublished ? new Date().toISOString() : '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await this.create<BlogPost>(postData);
      return result;
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async updatePost(id: string, data: BlogPostUpdateRequest): Promise<ApiResponse<BlogPost>> {
    try {
      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // If title is being updated, generate new slug
      if (data.title) {
        const baseSlug = this.generateSlug(data.title);
        const uniqueSlug = await this.ensureUniqueSlug(baseSlug, id);
        updateData.slug = uniqueSlug;
      }

      // If publishing the post, set publishedAt
      if (data.isPublished) {
        updateData.publishedAt = new Date().toISOString();
      }

      const result = await this.update<BlogPost>(id, updateData);
      return result;
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async deletePost(id: string): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.delete(id);
      return result;
    } catch (error) {
      return {
        data: false,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getPostStats(): Promise<ApiResponse<{
    total: number;
    published: number;
    draft: number;
  }>> {
    try {
      const [totalResult, publishedResult, draftResult] = await Promise.all([
        this.count(),
        this.count([{ field: 'isPublished', operator: '==', value: true }]),
        this.count([{ field: 'isPublished', operator: '==', value: false }]),
      ]);

      if (totalResult.success && publishedResult.success && draftResult.success) {
        return {
          data: {
            total: totalResult.data || 0,
            published: publishedResult.data || 0,
            draft: draftResult.data || 0,
          },
          error: null,
          success: true,
        };
      }

      throw new Error('Failed to get post statistics');
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getAllPublishedSlugs(): Promise<string[]> {
    try {
      const result = await this.getAll<BlogPost>({
        filters: [{ field: 'isPublished', operator: '==', value: true }]
      });

      if (result.success && result.data) {
        return result.data.map(post => post.slug);
      }
      return [];
    } catch {
      return [];
    }
  }
}

export const blogApi = new BlogApiService();
