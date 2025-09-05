import { WhereFilterOp } from 'firebase/firestore';
import { BaseApiService } from './base';
import { 
  YogaClass, 
  ClassCreateRequest, 
  ClassUpdateRequest, 
  ClassFilters,
  ApiResponse 
} from './types';

class ClassesApiService extends BaseApiService {
  constructor() {
    super('classes');
  }

  async createClass(classData: ClassCreateRequest): Promise<ApiResponse<YogaClass>> {
    const classDoc = {
      ...classData,
      isActive: true,
    };

    return this.create<YogaClass>(classDoc);
  }

  async updateClass(id: string, classData: ClassUpdateRequest): Promise<ApiResponse<YogaClass>> {
    return this.update<YogaClass>(id, classData);
  }

  async getClass(id: string): Promise<ApiResponse<YogaClass>> {
    return this.getById<YogaClass>(id);
  }

  async deleteClass(id: string): Promise<ApiResponse<boolean>> {
    // Soft delete by setting isActive to false
    const result = await this.update<YogaClass>(id, { isActive: false });
    
    if (result.success) {
      return {
        data: true,
        error: null,
        success: true,
      };
    }

    return {
      data: false,
      error: result.error,
      success: false,
    };
  }

  async getAllClasses(filters?: ClassFilters): Promise<ApiResponse<YogaClass[]>> {
    const queryFilters: Array<{ field: string; operator: WhereFilterOp; value: unknown }> = [];
    
    if (filters?.active !== undefined) {
      queryFilters.push({
        field: 'isActive',
        operator: '==',
        value: filters.active
      });
    }

    if (filters?.difficulty) {
      queryFilters.push({
        field: 'difficulty',
        operator: '==',
        value: filters.difficulty
      });
    }

    if (filters?.instructor) {
      queryFilters.push({
        field: 'instructor',
        operator: '==',
        value: filters.instructor
      });
    }

    if (filters?.category) {
      queryFilters.push({
        field: 'category',
        operator: '==',
        value: filters.category
      });
    }

    const result = await this.getAll<YogaClass>({
      orderByField: 'createdAt',
      orderDirection: 'desc',
      filters: queryFilters,
    });

    // Apply search filter (client-side)
    if (result.success && result.data && filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result.data = result.data.filter(cls => 
        cls.name.toLowerCase().includes(searchTerm) ||
        cls.description.toLowerCase().includes(searchTerm) ||
        cls.instructor.toLowerCase().includes(searchTerm)
      );
    }

    return result;
  }

  async getActiveClasses(): Promise<ApiResponse<YogaClass[]>> {
    return this.getAll<YogaClass>({
      orderByField: 'name',
      orderDirection: 'asc',
      filters: [
        {
          field: 'isActive',
          operator: '==',
          value: true
        }
      ],
    });
  }

  async getClassesByInstructor(instructor: string): Promise<ApiResponse<YogaClass[]>> {
    return this.getAll<YogaClass>({
      orderByField: 'name',
      orderDirection: 'asc',
      filters: [
        {
          field: 'instructor',
          operator: '==',
          value: instructor
        },
        {
          field: 'isActive',
          operator: '==',
          value: true
        }
      ],
    });
  }

  async getClassesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<ApiResponse<YogaClass[]>> {
    return this.getAll<YogaClass>({
      orderByField: 'name',
      orderDirection: 'asc',
      filters: [
        {
          field: 'difficulty',
          operator: '==',
          value: difficulty
        },
        {
          field: 'isActive',
          operator: '==',
          value: true
        }
      ],
    });
  }

  async getClassesByCategory(category: string): Promise<ApiResponse<YogaClass[]>> {
    return this.getAll<YogaClass>({
      orderByField: 'name',
      orderDirection: 'asc',
      filters: [
        {
          field: 'category',
          operator: '==',
          value: category
        },
        {
          field: 'isActive',
          operator: '==',
          value: true
        }
      ],
    });
  }

  async toggleClassStatus(id: string): Promise<ApiResponse<YogaClass>> {
    try {
      const classResult = await this.getById<YogaClass>(id);
      
      if (!classResult.success || !classResult.data) {
        return {
          data: null,
          error: classResult.error || 'Không tìm thấy lớp học',
          success: false,
        };
      }

      const currentStatus = classResult.data.isActive;
      return this.update<YogaClass>(id, { isActive: !currentStatus });
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getInstructors(): Promise<ApiResponse<string[]>> {
    try {
      const result = await this.getAll<YogaClass>({
        filters: [
          {
            field: 'isActive',
            operator: '==',
            value: true
          }
        ],
      });

      if (!result.success || !result.data) {
        return {
          data: [],
          error: result.error || 'Không thể lấy danh sách giảng viên',
          success: false,
        };
      }

      // Get unique instructors
      const instructors = [...new Set(result.data.map(cls => cls.instructor))];
      
      return {
        data: instructors,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const result = await this.getAll<YogaClass>({
        filters: [
          {
            field: 'isActive',
            operator: '==',
            value: true
          }
        ],
      });

      if (!result.success || !result.data) {
        return {
          data: [],
          error: result.error || 'Không thể lấy danh sách danh mục',
          success: false,
        };
      }

      // Get unique categories (filter out undefined/null)
      const categories = [...new Set(
        result.data
          .map(cls => cls.category)
          .filter((category): category is string => category !== undefined && category !== null && category.trim() !== '')
      )];
      
      return {
        data: categories,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getClassStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    byDifficulty: Record<string, number>;
    byInstructor: Record<string, number>;
    avgDuration: number;
    avgCapacity: number;
  }>> {
    try {
      const [totalResult, activeResult, inactiveResult, allClassesResult] = await Promise.all([
        this.count(),
        this.count([{ field: 'isActive', operator: '==', value: true }]),
        this.count([{ field: 'isActive', operator: '==', value: false }]),
        this.getAll<YogaClass>(),
      ]);

      if (!totalResult.success || !activeResult.success || !inactiveResult.success || !allClassesResult.success) {
        return {
          data: null,
          error: 'Không thể lấy thống kê lớp học',
          success: false,
        };
      }

      const classes = allClassesResult.data || [];
      const activeClasses = classes.filter(cls => cls.isActive);

      // Count by difficulty
      const byDifficulty: Record<string, number> = {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
      };
      
      activeClasses.forEach(cls => {
        byDifficulty[cls.difficulty] = (byDifficulty[cls.difficulty] || 0) + 1;
      });

      // Count by instructor
      const byInstructor: Record<string, number> = {};
      activeClasses.forEach(cls => {
        byInstructor[cls.instructor] = (byInstructor[cls.instructor] || 0) + 1;
      });

      // Calculate averages
      const avgDuration = activeClasses.length > 0 
        ? Math.round(activeClasses.reduce((sum, cls) => sum + cls.duration, 0) / activeClasses.length)
        : 0;
      
      const avgCapacity = activeClasses.length > 0 
        ? Math.round(activeClasses.reduce((sum, cls) => sum + cls.maxCapacity, 0) / activeClasses.length)
        : 0;

      return {
        data: {
          total: totalResult.data || 0,
          active: activeResult.data || 0,
          inactive: inactiveResult.data || 0,
          byDifficulty,
          byInstructor,
          avgDuration,
          avgCapacity,
        },
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async duplicateClass(id: string, newName?: string): Promise<ApiResponse<YogaClass>> {
    try {
      const originalResult = await this.getById<YogaClass>(id);
      
      if (!originalResult.success || !originalResult.data) {
        return {
          data: null,
          error: originalResult.error || 'Không tìm thấy lớp học để sao chép',
          success: false,
        };
      }

      const original = originalResult.data;
      const { id: _originalId, createdAt: _createdAt, updatedAt: _updatedAt, ...classData } = original;
      
      const duplicatedClass = {
        ...classData,
        name: newName || `${original.name} (Bản sao)`,
        isActive: false, // Start as inactive for review
      };

      return this.create<YogaClass>(duplicatedClass);
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async updateClassInstructor(id: string, instructor: string, instructorId?: string): Promise<ApiResponse<YogaClass>> {
    return this.update<YogaClass>(id, { 
      instructor,
      instructorId 
    });
  }

  async bulkUpdateClassStatus(ids: string[], isActive: boolean): Promise<ApiResponse<YogaClass[]>> {
    try {
      const updatePromises = ids.map(id => this.update<YogaClass>(id, { isActive }));
      const results = await Promise.all(updatePromises);
      
      const successfulUpdates: YogaClass[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.success && result.data) {
          successfulUpdates.push(result.data);
        } else {
          errors.push(`Lớp ${ids[index]}: ${result.error}`);
        }
      });

      if (errors.length > 0) {
        return {
          data: successfulUpdates,
          error: `Một số cập nhật thất bại: ${errors.join(', ')}`,
          success: false,
        };
      }

      return {
        data: successfulUpdates,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async searchClasses(searchTerm: string, filters?: Omit<ClassFilters, 'search'>): Promise<ApiResponse<YogaClass[]>> {
    const result = await this.getAllClasses({ ...filters, search: searchTerm });
    return result;
  }
}

export const classesApi = new ClassesApiService();
