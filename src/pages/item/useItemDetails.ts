import { useParams } from "react-router-dom";
import { useAuth } from "@/app/providers/useAuth";
import { useQuestionDetails } from "./hooks/useQuestionDetails";
import { useSnippetDetails } from "./hooks/useSnippetDetails";
export {
  type Mode,
  type BaseState,
  type QuestionState,
  type SnippetState,
  type ItemState,
} from "./hooks/itemTypes";
import type { ItemState, Mode } from "./hooks/itemTypes";

export function useItemDetails(mode: Mode): ItemState {
  const { id } = useParams<{ id: string }>();
  useAuth();
  // Вызвать оба хука (один будет лишним) чтобы соблюсти порядок хуков.
  const questionState = useQuestionDetails(id);
  const snippetState = useSnippetDetails(id);
  return (mode === "question" ? questionState : snippetState) as ItemState;
}
