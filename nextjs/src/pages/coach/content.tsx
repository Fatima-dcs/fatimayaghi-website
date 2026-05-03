import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

type ContentKey = "about_coach" | "about_it" | "why_arabic";

function ContentSection({
  title,
  contentKey,
  showEnglish,
  initialEn,
  initialAr,
}: {
  title: string;
  contentKey: ContentKey;
  showEnglish: boolean;
  initialEn: string;
  initialAr: string;
}) {
  const { toast } = useToast();
  const [en, setEn] = useState(initialEn);
  const [ar, setAr] = useState(initialAr);

  useEffect(() => { setEn(initialEn); }, [initialEn]);
  useEffect(() => { setAr(initialAr); }, [initialAr]);

  const update = api.content.update.useMutation({
    onSuccess: () => toast({ title: "Saved" }),
    onError: () => toast({ title: "Error saving", variant: "destructive" }),
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4 shadow-sm">
      <h2 className="font-semibold text-stone-800">{title}</h2>
      <div className={`grid gap-4 ${showEnglish ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {showEnglish && (
          <div className="space-y-2">
            <Label className="text-xs text-stone-500 uppercase tracking-wide">English</Label>
            <Textarea
              value={en}
              onChange={(e) => setEn(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-xs text-stone-500 uppercase tracking-wide">Arabic</Label>
          <Textarea
            dir="rtl"
            value={ar}
            onChange={(e) => setAr(e.target.value)}
            rows={6}
            className="resize-none text-right"
          />
        </div>
      </div>
      <Button
        onClick={() => update.mutate({ key: contentKey, value_en: en, value_ar: ar })}
        disabled={update.isPending}
        className="bg-teal-600 hover:bg-teal-700 text-white rounded-full"
      >
        {update.isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

export default function CoachContentPage() {
  const { data: content, isLoading } = api.content.list.useQuery();

  return (
    <DashboardLayout title="Edit Content">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Edit Website Content</h1>
          <p className="text-stone-500 text-sm mt-1">
            Changes save immediately and appear on the public website.
          </p>
        </div>

        {isLoading ? (
          <p className="text-stone-400 text-sm">Loading...</p>
        ) : (
          <div className="space-y-6">
            <ContentSection
              title="About — Coach"
              contentKey="about_coach"
              showEnglish
              initialEn={content?.about_coach?.value_en ?? ""}
              initialAr={content?.about_coach?.value_ar ?? ""}
            />
            <ContentSection
              title="About — IT Professional"
              contentKey="about_it"
              showEnglish
              initialEn={content?.about_it?.value_en ?? ""}
              initialAr={content?.about_it?.value_ar ?? ""}
            />
            <ContentSection
              title="Why I Do This (Arabic section)"
              contentKey="why_arabic"
              showEnglish={false}
              initialEn=""
              initialAr={content?.why_arabic?.value_ar ?? ""}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
