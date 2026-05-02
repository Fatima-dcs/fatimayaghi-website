import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n";

const categoryIcons: Record<string, string> = {
  assessment: "🎯",
  reflection: "🪞",
  planning: "🗺️",
};

export default function ToolsPage() {
  const { lang } = useTranslation();
  const { data: tools, isLoading } = api.tools.list.useQuery();

  return (
    <DashboardLayout title="Tools">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            {lang === "ar" ? "أدوات الكوتشينغ" : "Coaching Tools"}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {lang === "ar"
              ? "أدوات يمكنك تحميلها لمساعدتك في رحلتك"
              : "Download these tools to support your coaching journey"}
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools?.map((tool) => (
            <a
              key={tool.id}
              href={tool.file_url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all space-y-3"
            >
              <div className="text-4xl">{categoryIcons[tool.category ?? ""] ?? "📄"}</div>
              <div>
                <h3 className="font-semibold text-stone-800 group-hover:text-teal-700 transition-colors">
                  {lang === "ar" ? tool.name_ar : tool.name}
                </h3>
                {(lang === "ar" ? tool.description_ar : tool.description) && (
                  <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                    {lang === "ar" ? tool.description_ar : tool.description}
                  </p>
                )}
              </div>
              <p className="text-xs font-medium text-teal-600 group-hover:underline">
                {lang === "ar" ? "⬇️ تحميل" : "⬇️ Download"}
              </p>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
