import { useItemDetails } from "./useItemDetails";
import { ItemDetailsView } from "./ItemDetailsView";

export default function ItemDetailsPage({
  mode,
}: {
  mode: "question" | "snippet";
}) {
  const state = useItemDetails(mode);
  return <ItemDetailsView {...state} />;
}
