import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Movie } from "@/api/movies";
import { toast } from "sonner";
import { api } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

interface MovieModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

// Récupérer les réservations existantes pour vérifier les conflits
const useUserReservations = () => {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const response = await api.get("/reservations");
      return response.data.reservations;
    },
  });
};

// Générer les créneaux horaires disponibles (de 10h à 22h)
const generateTimeSlots = (
  selectedDate: Date | undefined,
  existingReservations: any[]
) => {
  if (!selectedDate) return [];

  const slots = [];
  // Générer les créneaux de 10h à 22h
  for (let hour = 10; hour <= 22; hour++) {
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hour, 0, 0, 0);

    // Ne pas proposer les créneaux passés
    const now = new Date();
    if (slotTime <= now) continue;

    let isAvailable = true;

    // Vérifier les conflits avec les réservations existantes
    for (const reservation of existingReservations) {
      // Ajuster l'heure de la réservation existante pour correspondre à l'heure locale
      const reservationStart = new Date(reservation.startTime);

      // Calculer la différence en minutes entre les heures de début
      const minutesBetweenStarts = Math.abs(
        (slotTime.getTime() - reservationStart.getTime()) / (1000 * 60)
      );

      if (minutesBetweenStarts < 119) {
        isAvailable = false;
        break;
      }
    }

    if (isAvailable) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
  }
  return slots;
};

const formatReleaseDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Date non disponible";

  try {
    const date = new Date(dateString);
    // Vérifie si la date est valide
    if (isNaN(date.getTime())) {
      return "Date non disponible";
    }
    return format(date, "d MMMM yyyy", { locale: fr });
  } catch (error) {
    return "Date non disponible";
  }
};

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const { data: reservations = [] } = useUserReservations();

  const handleReservation = async () => {
    if (!date || !time) {
      toast.error("Veuillez sélectionner une date et une heure");
      return;
    }

    try {
      // Créer une date avec le bon fuseau horaire
      const [hours] = time.split(":");
      const startTime = new Date(date);
      startTime.setHours(parseInt(hours), 0, 0, 0);
      // Pas besoin d'ajouter +2 heures car on veut envoyer l'heure exacte choisie

      await api.post("/reservations", {
        movieId: movie.id,
        startTime: startTime.toISOString(), // Envoyer directement l'heure choisie
      });

      toast.success("Réservation confirmée", {
        description: `Votre séance pour ${
          movie.title
        } est réservée pour le ${format(startTime, "d MMMM à HH'h'mm", {
          locale: fr,
        })}`,
      });

      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";
      toast.error("Erreur de réservation", {
        description: errorMessage,
      });
    }
  };

  const availableTimeSlots = generateTimeSlots(date, reservations);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] h-auto max-h-[80vh] p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Colonne de gauche avec l'affiche (50%) */}
          <div className="md:w-1/2 relative h-[300px] md:h-auto">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Colonne de droite avec les informations et la réservation (50%) */}
          <div className="md:w-1/2 p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {movie.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Informations du film */}
              <div className="space-y-4">
                <DialogDescription className="text-base leading-relaxed">
                  {movie.overview}
                </DialogDescription>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Date de sortie :</span>
                    <p>{formatReleaseDate(movie.release_date)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Note :</span>
                    <p>
                      {movie.vote_average}/10 ({movie.vote_count} votes)
                    </p>
                  </div>
                </div>
              </div>

              {/* Section réservation */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-medium text-lg">Réserver une séance</h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ before: new Date() }}
                  className="rounded-md border"
                  locale={fr}
                />

                <Select
                  value={time}
                  onValueChange={setTime}
                  disabled={!date || availableTimeSlots.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !date
                          ? "Sélectionnez d'abord une date"
                          : availableTimeSlots.length === 0
                          ? "Aucun créneau disponible"
                          : "Sélectionner un horaire"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {date && availableTimeSlots.length === 0 && (
                  <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                    Aucun créneau disponible pour cette date. Il doit y avoir au
                    moins 1h59 entre les débuts de chaque séance.
                  </p>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  onClick={handleReservation}
                  disabled={!date || !time || availableTimeSlots.length === 0}
                >
                  Réserver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
