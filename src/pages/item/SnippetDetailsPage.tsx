import { useParams } from "react-router-dom";
import { useAuth } from "@/app/providers/useAuth";
import { useSnippetDetails } from "./snippet/useSnippetDetails";
import { ItemDetailsView } from "./ItemDetailsView";

export function SnippetDetailsPage() {
  const { id } = useParams<{ id: string }>();
  useAuth();
  const state = useSnippetDetails(id);
  return <ItemDetailsView {...state} />;
}

export default SnippetDetailsPage;
