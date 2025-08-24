import { useParams } from "react-router-dom";
import { useAuth } from "@/app/providers/useAuth";
import { useQuestionDetails } from "./hooks/useQuestionDetails";
import { ItemDetailsView } from "./ItemDetailsView";

export function QuestionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  useAuth();
  const state = useQuestionDetails(id);
  return <ItemDetailsView {...state} />;
}

export default QuestionDetailsPage;
