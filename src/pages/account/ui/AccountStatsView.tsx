import { memo } from "react";
import { Skeleton } from "@/shared/ui/Skeleton";
import type { UserStatistic } from "@/entities/user/types";

export type AccountStatsViewProps = {
  statistic?: UserStatistic;
  status?: "idle" | "pending" | "success" | "error" | string;
};

export const AccountStatsView = memo(function AccountStatsView({
  statistic,
  status,
}: AccountStatsViewProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">Статистика</h2>
      {status === "pending" && (
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="border rounded p-2">
              <Skeleton height={16} />
            </li>
          ))}
        </ul>
      )}
      {status === "error" && (
        <p className="text-red-600">Не удалось загрузить статистику.</p>
      )}
      {statistic ? (
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li className="border rounded p-2">
            Сниппеты: {statistic.snippetsCount}
          </li>
          <li className="border rounded p-2">
            Рейтинг: {Math.round(statistic.rating)}
          </li>
          <li className="border rounded p-2">
            Комментарии: {statistic.commentsCount}
          </li>
          <li className="border rounded p-2">Лайки: {statistic.likesCount}</li>
          <li className="border rounded p-2">
            Дизлайки: {statistic.dislikesCount}
          </li>
          <li className="border rounded p-2">
            Вопросы: {statistic.questionsCount}
          </li>
          <li className="border rounded p-2">
            Верных ответов: {statistic.correctAnswersCount}
          </li>
          <li className="border rounded p-2">
            Обычных ответов: {statistic.regularAnswersCount}
          </li>
        </ul>
      ) : (
        <p className="text-gray-500">Нет данных статистики.</p>
      )}
    </section>
  );
});

export default AccountStatsView;
