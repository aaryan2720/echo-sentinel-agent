import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

export const useNotification = () => {
  const { toast } = useToast();

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: "border-success/30 bg-success/10",
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: "border-destructive/30 bg-destructive/10",
      variant: "destructive",
    });
  };

  const showWarning = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: "border-warning/30 bg-warning/10",
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      className: "border-primary/30 bg-primary/10",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
