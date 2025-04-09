import { api } from "./auth";

export interface Reservation {
  id: number;
  movieId: number;
  movieTitle: string;
  startTime: string;
  endTime: string;
  userId: number;
}

interface ReservationListResponse {
  reservations: Reservation[];
  total: number;
}

export const reservationsApi = {
  getAll: async (): Promise<ReservationListResponse> => {
    const response = await api.get<ReservationListResponse>("/reservations");
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/reservations/${id}`);
  },
};
