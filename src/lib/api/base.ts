import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  FirestoreError,
  WhereFilterOp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ApiResponse, PaginatedResponse } from "./types";

export class BaseApiService {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollection() {
    return collection(db, this.collectionName);
  }

  protected getDoc(id: string) {
    return doc(db, this.collectionName, id);
  }

  protected handleError(error: unknown): string {
    console.error(`${this.collectionName} API Error:`, error);

    if (error instanceof FirestoreError) {
      switch (error.code) {
        case "permission-denied":
          return "Bạn không có quyền thực hiện thao tác này";
        case "not-found":
          return "Không tìm thấy dữ liệu";
        case "already-exists":
          return "Dữ liệu đã tồn tại";
        case "unavailable":
          return "Dịch vụ tạm thời không khả dụng";
        case "deadline-exceeded":
          return "Yêu cầu hết thời gian chờ";
        default:
          return `Lỗi hệ thống: ${error.message}`;
      }
    }

    return (error as Error)?.message || "Đã xảy ra lỗi không xác định";
  }

  protected timestampToString(timestamp: Timestamp | unknown): string {
    if (!timestamp) return new Date().toISOString();
    if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
      return (timestamp as Timestamp).toDate().toISOString();
    }
    return String(timestamp);
  }

  protected stringToTimestamp(dateString: string): Timestamp {
    return Timestamp.fromDate(new Date(dateString));
  }

  // Generic CRUD operations
  async create<T extends DocumentData>(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<T & { id: string }>> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(this.getCollection(), docData);

      const createdDoc = await getDoc(docRef);
      if (!createdDoc.exists()) {
        return {
          data: null,
          error: "Không thể tạo dữ liệu",
          success: false,
        };
      }

      const createdDocData = createdDoc.data();
      const result = {
        id: createdDoc.id,
        ...createdDocData,
        createdAt: this.timestampToString(createdDocData.createdAt),
        updatedAt: this.timestampToString(createdDocData.updatedAt),
      } as unknown as T & { id: string };

      return {
        data: result,
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

  async getById<T extends DocumentData>(
    id: string
  ): Promise<ApiResponse<T & { id: string }>> {
    try {
      const docRef = this.getDoc(id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          data: null,
          error: "Không tìm thấy dữ liệu",
          success: false,
        };
      }

      const data = docSnap.data();
      const result = {
        id: docSnap.id,
        ...data,
        createdAt: this.timestampToString(data.createdAt),
        updatedAt: this.timestampToString(data.updatedAt),
      } as unknown as T & { id: string };

      return {
        data: result,
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

  async update<T extends DocumentData>(
    id: string,
    data: Partial<Omit<T, "id" | "createdAt">>
  ): Promise<ApiResponse<T & { id: string }>> {
    try {
      const docRef = this.getDoc(id);

      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return {
          data: null,
          error: "Không tìm thấy dữ liệu để cập nhật",
          success: false,
        };
      }

      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(docRef, updateData);

      // Get updated document
      const updatedDoc = await getDoc(docRef);
      const updatedData = updatedDoc.data();

      const result = {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: this.timestampToString(updatedData?.createdAt),
        updatedAt: this.timestampToString(updatedData?.updatedAt),
      } as unknown as T & { id: string };

      return {
        data: result,
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

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const docRef = this.getDoc(id);

      // Check if document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return {
          data: false,
          error: "Không tìm thấy dữ liệu để xóa",
          success: false,
        };
      }

      await deleteDoc(docRef);

      return {
        data: true,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: false,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getAll<T extends DocumentData>(
    queryOptions: {
      orderByField?: string;
      orderDirection?: "asc" | "desc";
      limitCount?: number;
      filters?: Array<{
        field: string;
        operator: WhereFilterOp;
        value: unknown;
      }>;
    } = {}
  ): Promise<ApiResponse<(T & { id: string })[]>> {
    try {
      let q = query(this.getCollection());

      // Apply filters
      if (queryOptions.filters?.length) {
        for (const filter of queryOptions.filters) {
          q = query(q, where(filter.field, filter.operator, filter.value));
        }
      }

      // Apply ordering
      if (queryOptions.orderByField) {
        q = query(
          q,
          orderBy(
            queryOptions.orderByField,
            queryOptions.orderDirection || "desc"
          )
        );
      }

      // Apply limit
      if (queryOptions.limitCount) {
        q = query(q, limit(queryOptions.limitCount));
      }

      const querySnapshot = await getDocs(q);
      const results: (T & { id: string })[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          id: doc.id,
          ...data,
          createdAt: this.timestampToString(data.createdAt),
          updatedAt: this.timestampToString(data.updatedAt),
        } as unknown as T & { id: string });
      });

      return {
        data: results,
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

  async getPaginated<T extends DocumentData>(
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot,
    queryOptions: {
      orderByField?: string;
      orderDirection?: "asc" | "desc";
      filters?: Array<{
        field: string;
        operator: WhereFilterOp;
        value: unknown;
      }>;
    } = {}
  ): Promise<PaginatedResponse<T & { id: string }>> {
    try {
      let q = query(this.getCollection());

      // Apply filters
      if (queryOptions.filters?.length) {
        for (const filter of queryOptions.filters) {
          q = query(q, where(filter.field, filter.operator, filter.value));
        }
      }

      // Apply ordering
      if (queryOptions.orderByField) {
        q = query(
          q,
          orderBy(
            queryOptions.orderByField,
            queryOptions.orderDirection || "desc"
          )
        );
      }

      // Apply pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(pageSize + 1)); // Get one extra to check if there are more

      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      const hasMore = docs.length > pageSize;

      if (hasMore) {
        docs.pop(); // Remove the extra document
      }

      const results: (T & { id: string })[] = docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: this.timestampToString(data.createdAt),
          updatedAt: this.timestampToString(data.updatedAt),
        } as unknown as T & { id: string };
      });

      return {
        data: results,
        total: results.length, // Note: This is not the total count across all pages
        page: lastDoc ? -1 : 0, // Firestore doesn't have page numbers
        limit: pageSize,
        hasMore,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        page: 0,
        limit: pageSize,
        hasMore: false,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  // Utility method to count documents (expensive operation, use sparingly)
  async count(
    filters?: Array<{ field: string; operator: WhereFilterOp; value: unknown }>
  ): Promise<ApiResponse<number>> {
    try {
      let q = query(this.getCollection());

      if (filters?.length) {
        for (const filter of filters) {
          q = query(q, where(filter.field, filter.operator, filter.value));
        }
      }

      const querySnapshot = await getDocs(q);

      return {
        data: querySnapshot.size,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: 0,
        error: this.handleError(error),
        success: false,
      };
    }
  }
}
