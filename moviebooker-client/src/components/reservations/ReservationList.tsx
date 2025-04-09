import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { reservationsApi, Reservation } from "@/api/reservations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export function ReservationList() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reservations"],
    queryFn: reservationsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: reservationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Réservation annulée avec succès");
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'annulation", {
        description: error.response?.data?.message || "Une erreur est survenue",
      });
    },
  });

  const handleDelete = (reservation: Reservation) => {
    const now = new Date();
    const startTime = new Date(reservation.startTime);

    if (startTime <= now) {
      toast.error("Impossible d'annuler une séance déjà commencée");
      return;
    }

    deleteMutation.mutate(reservation.id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Une erreur est survenue lors du chargement des réservations
      </div>
    );
  }

  if (!data || !data.reservations || data.reservations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-gray-500">
          Vous n'avez aucune réservation pour le moment
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {data.reservations.map((reservation) => {
        const startTime = new Date(reservation.startTime);
        const endTime = new Date(reservation.endTime);
        const isPast = startTime <= new Date();

        return (
          <Card key={reservation.id} className={isPast ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{reservation.movieTitle}</CardTitle>
                  <CardDescription>
                    {format(startTime, "EEEE d MMMM yyyy", { locale: fr })}
                  </CardDescription>
                </div>
                {!isPast && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(reservation)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Horaire : {format(startTime, "HH'h'mm", { locale: fr })} -{" "}
                {format(endTime, "HH'h'mm", { locale: fr })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
