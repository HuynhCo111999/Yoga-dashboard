import { BaseApiService } from "./base";
import type { ApiResponse, PaginatedResponse } from "./types";
import type { WhereFilterOp } from "firebase/firestore";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  metaTitle?: string;
  metaDescription?: string;
  author: string;
  publishedAt: string;
  tags: string[];
  isPublished: boolean;
  featuredImage?: string;
  showOnHome?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostCreateRequest {
  title: string;
  content: string;
  excerpt: string;
  metaTitle?: string;
  metaDescription?: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  featuredImage?: string;
  slug?: string;
  showOnHome?: boolean;
  isFeatured?: boolean;
}

export interface BlogPostUpdateRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
  featuredImage?: string;
  publishedAt?: string;
  slug?: string;
  showOnHome?: boolean;
  isFeatured?: boolean;
}

export interface BlogPostFilters {
  isPublished?: boolean;
  author?: string;
  tags?: string[];
}

class BlogApiService extends BaseApiService {
  constructor() {
    super("blog_posts");
  }

  // Generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .substring(0, 100); // Limit length
  }

  // Ensure unique slug
  private async ensureUniqueSlug(
    baseSlug: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.getAll<BlogPost>({
        filters: [{ field: "slug", operator: "==", value: slug }],
      });

      if (existing.success && existing.data) {
        const existingPost = existing.data.find(
          (post) => post.id !== excludeId,
        );
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

  async getAllPosts(
    filters?: BlogPostFilters,
  ): Promise<ApiResponse<BlogPost[]>> {
    try {
      const queryFilters: Array<{
        field: string;
        operator: WhereFilterOp;
        value: unknown;
      }> = [];

      if (filters?.isPublished !== undefined) {
        queryFilters.push({
          field: "isPublished",
          operator: "==",
          value: filters.isPublished,
        });
      }

      if (filters?.author) {
        queryFilters.push({
          field: "author",
          operator: "==",
          value: filters.author,
        });
      }

      const result = await this.getAll<BlogPost>({
        filters: queryFilters,
        orderByField: "publishedAt",
        orderDirection: "desc",
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

  async getAllPostsPaginated(
    pageSize: number = 10,
  ): Promise<PaginatedResponse<BlogPost>> {
    return this.getPaginated<BlogPost>(pageSize, undefined, {
      orderByField: "publishedAt",
      orderDirection: "desc",
    });
  }

  async getPublishedPostsPaginated(
    page: number = 1,
    pageSize: number = 9,
  ): Promise<PaginatedResponse<BlogPost>> {
    const result = await this.getAll<BlogPost>({
      filters: [{ field: "isPublished", operator: "==", value: true }],
      orderByField: "publishedAt",
      orderDirection: "desc",
    });

    if (!result.success || !result.data) {
      return {
        data: [],
        total: 0,
        page,
        limit: pageSize,
        hasMore: false,
        error: result.error,
        success: false,
      };
    }

    const totalAll = result.data.length;

    const all = result.data.filter((post) => !post.isFeatured);
    const start = (page - 1) * pageSize;
    const pageData = all.slice(start, start + pageSize);
    const hasMore = start + pageSize < all.length;

    return {
      data: pageData,
      total: totalAll,
      page,
      limit: pageSize,
      hasMore,
      error: null,
      success: true,
    };
  }

  async getFeaturedPost(): Promise<ApiResponse<BlogPost | null>> {
    const result = await this.getAll<BlogPost>({
      filters: [
        { field: "isPublished", operator: "==", value: true },
        { field: "isFeatured", operator: "==", value: true },
      ],
      orderByField: "publishedAt",
      orderDirection: "desc",
      limitCount: 1,
    });

    if (!result.success || !result.data || result.data.length === 0) {
      return { data: null, error: result.error, success: !!result.success };
    }

    return { data: result.data[0], error: null, success: true };
  }

  async getHomePosts(limitCount: number = 3): Promise<ApiResponse<BlogPost[]>> {
    return this.getAll<BlogPost>({
      filters: [
        { field: "isPublished", operator: "==", value: true },
        { field: "showOnHome", operator: "==", value: true },
      ],
      orderByField: "publishedAt",
      orderDirection: "desc",
      limitCount,
    });
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
          error: result.error || "Không tìm thấy bài viết",
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
        filters: [{ field: "slug", operator: "==", value: slug }],
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
          error: "Không tìm thấy bài viết",
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

  async createPost(
    data: BlogPostCreateRequest,
  ): Promise<ApiResponse<BlogPost>> {
    try {
      // Generate unique slug
      const baseSlug = this.generateSlug(data.slug || data.title);
      const slug = await this.ensureUniqueSlug(baseSlug);

      const postData = {
        ...data,
        showOnHome: data.showOnHome ?? false,
        isFeatured: data.isFeatured ?? false,
        slug,
        publishedAt: data.isPublished ? new Date().toISOString() : "",
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

  async updatePost(
    id: string,
    data: BlogPostUpdateRequest,
  ): Promise<ApiResponse<BlogPost>> {
    try {
      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // If title is being updated, generate new slug
      if (data.slug) {
        const baseSlug = this.generateSlug(data.slug);
        const uniqueSlug = await this.ensureUniqueSlug(baseSlug, id);
        updateData.slug = uniqueSlug;
      } else if (data.title) {
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

  async getPostStats(): Promise<
    ApiResponse<{
      total: number;
      published: number;
      draft: number;
    }>
  > {
    try {
      const [totalResult, publishedResult, draftResult] = await Promise.all([
        this.count(),
        this.count([{ field: "isPublished", operator: "==", value: true }]),
        this.count([{ field: "isPublished", operator: "==", value: false }]),
      ]);

      if (
        totalResult.success &&
        publishedResult.success &&
        draftResult.success
      ) {
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

      throw new Error("Failed to get post statistics");
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
        filters: [{ field: "isPublished", operator: "==", value: true }],
      });

      if (result.success && result.data) {
        return result.data.map((post) => post.slug);
      }
      return [];
    } catch {
      return [];
    }
  }
}

export const blogApi = new BlogApiService();
