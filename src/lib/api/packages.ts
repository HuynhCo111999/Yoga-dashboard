import { WhereFilterOp } from 'firebase/firestore';
import { BaseApiService } from './base';
import { 
  Package, 
  PackageCreateRequest, 
  PackageUpdateRequest, 
  PackageFilters,
  ApiResponse
} from './types';

class PackagesApiService extends BaseApiService {
  constructor() {
    super('packages');
  }

  async createPackage(packageData: PackageCreateRequest): Promise<ApiResponse<Package>> {
    const packageDoc = {
      ...packageData,
      isActive: true,
    };

    return this.create<Package>(packageDoc);
  }

  async updatePackage(id: string, packageData: PackageUpdateRequest): Promise<ApiResponse<Package>> {
    return this.update<Package>(id, packageData);
  }

  async getPackage(id: string): Promise<ApiResponse<Package>> {
    return this.getById<Package>(id);
  }

  async deletePackage(id: string): Promise<ApiResponse<boolean>> {
    // Soft delete by setting isActive to false
    const result = await this.update<Package>(id, { isActive: false });
    
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

  async getAllPackages(filters?: PackageFilters): Promise<ApiResponse<Package[]>> {
    const queryFilters: Array<{ field: string; operator: WhereFilterOp; value: unknown }> = [];
    
    if (filters?.active !== undefined) {
      queryFilters.push({
        field: 'isActive',
        operator: '==',
        value: filters.active
      });
    }

    if (filters?.priceMin !== undefined) {
      queryFilters.push({
        field: 'price',
        operator: '>=',
        value: filters.priceMin
      });
    }

    if (filters?.priceMax !== undefined) {
      queryFilters.push({
        field: 'price',
        operator: '<=',
        value: filters.priceMax
      });
    }

    const result = await this.getAll<Package>({
      orderByField: 'createdAt',
      orderDirection: 'desc',
      filters: queryFilters,
    });

    // Apply search filter (client-side)
    if (result.success && result.data && filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result.data = result.data.filter(pkg => 
        pkg.name.toLowerCase().includes(searchTerm) ||
        pkg.description.toLowerCase().includes(searchTerm)
      );
    }

    return result;
  }

  async getActivePackages(): Promise<ApiResponse<Package[]>> {
    return this.getAll<Package>({
      orderByField: 'price',
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

  async getPackagesByPriceRange(minPrice: number, maxPrice: number): Promise<ApiResponse<Package[]>> {
    return this.getAll<Package>({
      orderByField: 'price',
      orderDirection: 'asc',
      filters: [
        {
          field: 'price',
          operator: '>=',
          value: minPrice
        },
        {
          field: 'price',
          operator: '<=',
          value: maxPrice
        },
        {
          field: 'isActive',
          operator: '==',
          value: true
        }
      ],
    });
  }

  async togglePackageStatus(id: string): Promise<ApiResponse<Package>> {
    try {
      const packageResult = await this.getById<Package>(id);
      
      if (!packageResult.success || !packageResult.data) {
        return {
          data: null,
          error: packageResult.error || 'Không tìm thấy gói tập',
          success: false,
        };
      }

      const currentStatus = packageResult.data.isActive;
      return this.update<Package>(id, { isActive: !currentStatus });
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getMostPopularPackage(): Promise<ApiResponse<Package>> {
    // This would require counting member subscriptions
    // For now, return the first active package
    const result = await this.getAll<Package>({
      orderByField: 'createdAt',
      orderDirection: 'asc',
      filters: [
        {
          field: 'isActive',
          operator: '==',
          value: true
        }
      ],
      limitCount: 1,
    });

    if (result.success && result.data && result.data.length > 0) {
      return {
        data: result.data[0],
        error: null,
        success: true,
      };
    }

    return {
      data: null,
      error: 'Không tìm thấy gói tập nào',
      success: false,
    };
  }

  async getPackageStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    avgPrice: number;
    totalRevenue: number;
  }>> {
    try {
      const [totalResult, activeResult, inactiveResult, allPackagesResult] = await Promise.all([
        this.count(),
        this.count([{ field: 'isActive', operator: '==', value: true }]),
        this.count([{ field: 'isActive', operator: '==', value: false }]),
        this.getAll<Package>(),
      ]);

      if (!totalResult.success || !activeResult.success || !inactiveResult.success || !allPackagesResult.success) {
        return {
          data: null,
          error: 'Không thể lấy thống kê gói tập',
          success: false,
        };
      }

      const packages = allPackagesResult.data || [];
      const activePrices = packages.filter(pkg => pkg.isActive).map(pkg => pkg.price);
      const avgPrice = activePrices.length > 0 ? activePrices.reduce((sum, price) => sum + price, 0) / activePrices.length : 0;
      
      // Total revenue would need member subscription data
      // For now, calculate potential revenue from active packages
      const totalRevenue = activePrices.reduce((sum, price) => sum + price, 0);

      return {
        data: {
          total: totalResult.data || 0,
          active: activeResult.data || 0,
          inactive: inactiveResult.data || 0,
          avgPrice: Math.round(avgPrice),
          totalRevenue,
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

  async duplicatePackage(id: string, newName?: string): Promise<ApiResponse<Package>> {
    try {
      const originalResult = await this.getById<Package>(id);
      
      if (!originalResult.success || !originalResult.data) {
        return {
          data: null,
          error: originalResult.error || 'Không tìm thấy gói tập để sao chép',
          success: false,
        };
      }

      const original = originalResult.data;
      const { id: _originalId, createdAt: _createdAt, updatedAt: _updatedAt, ...packageData } = original;
      
      const duplicatedPackage = {
        ...packageData,
        name: newName || `${original.name} (Bản sao)`,
        isActive: false, // Start as inactive for review
      };

      return this.create<Package>(duplicatedPackage);
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getPackagesByClassLimit(unlimited: boolean = false): Promise<ApiResponse<Package[]>> {
    const operator = unlimited ? '==' : '>';
    const value = unlimited ? -1 : -1;
    
    return this.getAll<Package>({
      orderByField: 'price',
      orderDirection: 'asc',
      filters: [
        {
          field: 'classLimit',
          operator,
          value
        },
        {
          field: 'isActive',
          operator: '==',
          value: true
        }
      ],
    });
  }

  async updatePackagePrice(id: string, newPrice: number): Promise<ApiResponse<Package>> {
    if (newPrice < 0) {
      return {
        data: null,
        error: 'Giá không thể âm',
        success: false,
      };
    }

    return this.update<Package>(id, { price: newPrice });
  }

  async bulkUpdatePackageStatus(ids: string[], isActive: boolean): Promise<ApiResponse<Package[]>> {
    try {
      const updatePromises = ids.map(id => this.update<Package>(id, { isActive }));
      const results = await Promise.all(updatePromises);
      
      const successfulUpdates: Package[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.success && result.data) {
          successfulUpdates.push(result.data);
        } else {
          errors.push(`Gói ${ids[index]}: ${result.error}`);
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
}

export const packagesApi = new PackagesApiService();
