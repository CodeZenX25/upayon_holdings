"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  Trash2,
  Save,
  LoaderCircle,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUploader } from "@/components/admin/image-uploader";

interface SiteSettingsData {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  socialLinks: Array<{ platform: string; url: string }>;
  stats: {
    years: number;
    completed: number;
    ongoing: number;
    families: number;
  };
  heroSlides: Array<{
    title: string;
    subtitle: string;
    image: string;
    videoUrl?: string;
    mediaType?: "image" | "video";
    buttonText?: string;
    buttonUrl?: string;
    order: number;
  }>;
}

const defaultSettings: SiteSettingsData = {
  phone: "+880 1339336953",
  email: "info@upayonholdings.com",
  address: "Upayon Group, House-342, Road-5, Avenue 3, Mirpur DOHS, Dhaka 1216",
  whatsapp: "+880 1339336953",
  socialLinks: [
    { platform: "Facebook", url: "https://facebook.com/upayonholdings" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/upayonholdings" },
    { platform: "Instagram", url: "https://instagram.com/upayonholdings" },
  ],
  stats: {
    years: 12,
    completed: 18,
    ongoing: 7,
    families: 520,
  },
  heroSlides: [
    {
      title: "Land & Flat Share Developments in Dhaka",
      subtitle: "Transparent co-ownership model delivering prime urban properties at real cost.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80",
      buttonText: "Explore Projects",
      buttonUrl: "/projects",
      order: 0,
    },
  ],
};

export function SettingsView() {
  const [settings, setSettings] = React.useState<SiteSettingsData>(defaultSettings);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("contact");

  const fetchSettings = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      const data = await res.json();
      setSettings({
        ...defaultSettings,
        ...data,
        socialLinks: data.socialLinks || defaultSettings.socialLinks,
        stats: { ...defaultSettings.stats, ...(data.stats || {}) },
        heroSlides: data.heroSlides || defaultSettings.heroSlides,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load site settings");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update settings");
      }

      toast.success("Site settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            Site Settings
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure contact coordinates, brand metrics, social profiles, and homepage hero slides.
          </p>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="gap-1.5 bg-primary text-white hover:bg-navy-800"
        >
          {saving ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span>Save All Settings</span>
        </Button>
      </div>

      <Card className="border-border shadow-xs">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1 bg-muted/60 mb-6">
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="stats">Company Stats</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
              <TabsTrigger value="slides">Hero Slides</TabsTrigger>
            </TabsList>

            {/* TAB 1: CONTACT INFO */}
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Official Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-9"
                      value={settings.phone || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+880 1700-000000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp">WhatsApp Business Number</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="whatsapp"
                      className="pl-9"
                      value={settings.whatsapp || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, whatsapp: e.target.value }))
                      }
                      placeholder="+880 1700-000000"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">Contact Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      value={settings.email || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="info@upayonholdings.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Headquarters Office Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      rows={3}
                      className="pl-9"
                      value={settings.address || ""}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, address: e.target.value }))
                      }
                      placeholder="House-342, Road-5, Avenue 3, Mirpur DOHS, Dhaka 1216"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: STATS */}
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 rounded-lg border border-border p-4 bg-card">
                  <Label htmlFor="years">Years of Experience</Label>
                  <Input
                    id="years"
                    type="number"
                    min="0"
                    value={settings.stats.years}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          years: parseInt(e.target.value, 10) || 0,
                        },
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Displayed on homepage experience banner.
                  </p>
                </div>

                <div className="space-y-1.5 rounded-lg border border-border p-4 bg-card">
                  <Label htmlFor="completed">Completed Projects</Label>
                  <Input
                    id="completed"
                    type="number"
                    min="0"
                    value={settings.stats.completed}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          completed: parseInt(e.target.value, 10) || 0,
                        },
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Delivered land and apartment projects.
                  </p>
                </div>

                <div className="space-y-1.5 rounded-lg border border-border p-4 bg-card">
                  <Label htmlFor="ongoing">Ongoing Projects</Label>
                  <Input
                    id="ongoing"
                    type="number"
                    min="0"
                    value={settings.stats.ongoing}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          ongoing: parseInt(e.target.value, 10) || 0,
                        },
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Currently under development across Dhaka.
                  </p>
                </div>

                <div className="space-y-1.5 rounded-lg border border-border p-4 bg-card">
                  <Label htmlFor="families">Happy Families (Clients)</Label>
                  <Input
                    id="families"
                    type="number"
                    min="0"
                    value={settings.stats.families}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          families: parseInt(e.target.value, 10) || 0,
                        },
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Owners and investors trusted with Upayon.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: SOCIAL LINKS */}
            <TabsContent value="social" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Official Social Handles</h4>
                  <p className="text-xs text-muted-foreground">
                    Displayed in website header and footer.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      socialLinks: [
                        ...prev.socialLinks,
                        { platform: "Facebook", url: "https://" },
                      ],
                    }))
                  }
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-2">
                {settings.socialLinks.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border border-border p-2.5 bg-card"
                  >
                    <div className="w-1/3">
                      <Input
                        placeholder="Platform (e.g. Facebook)"
                        value={link.platform}
                        onChange={(e) => {
                          const updated = [...settings.socialLinks];
                          updated[idx].platform = e.target.value;
                          setSettings((prev) => ({ ...prev, socialLinks: updated }));
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...settings.socialLinks];
                          updated[idx].url = e.target.value;
                          setSettings((prev) => ({ ...prev, socialLinks: updated }));
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
                        }))
                      }
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 4: HERO SLIDES */}
            <TabsContent value="slides" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Homepage Hero Slider</h4>
                  <p className="text-xs text-muted-foreground">
                    Promotional slides featured at the top of the public landing page.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      heroSlides: [
                        ...prev.heroSlides,
                        {
                          title: "New Landmark Development",
                          subtitle: "Join our latest land share circle with prime connectivity.",
                          image:
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
                          buttonText: "View Details",
                          buttonUrl: "/projects",
                          order: prev.heroSlides.length,
                        },
                      ],
                    }))
                  }
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />
                  Add Slide
                </Button>
              </div>

              <div className="space-y-4">
                {settings.heroSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 rounded-lg border border-border p-4 bg-card"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-navy-900">
                        Slide #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={() =>
                          setSettings((prev) => ({
                            ...prev,
                            heroSlides: prev.heroSlides.filter((_, i) => i !== idx),
                          }))
                        }
                        className="text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1 sm:col-span-2">
                          <Label>Slide Title</Label>
                          <Input
                            value={slide.title}
                            onChange={(e) => {
                              const updated = [...settings.heroSlides];
                              updated[idx].title = e.target.value;
                              setSettings((prev) => ({ ...prev, heroSlides: updated }));
                            }}
                          />
                        </div>

                      <div className="space-y-1 sm:col-span-2">
                            <Label>Subtitle</Label>
                            <Textarea
                              rows={2}
                              value={slide.subtitle}
                              onChange={(e) => {
                                const updated = [...settings.heroSlides];
                                updated[idx].subtitle = e.target.value;
                                setSettings((prev) => ({ ...prev, heroSlides: updated }));
                              }}
                            />
                          </div>

                      <div className="space-y-1">
                              <Label>Background Media Type</Label>
                              <Select
                                value={slide.mediaType || "image"}
                                onChange={(e) => {
                                  const updated = [...settings.heroSlides];
                                  updated[idx].mediaType = e.target.value as "image" | "video";
                                  setSettings((prev) => ({ ...prev, heroSlides: updated }));
                                }}
                        >
                              <option value="image">Image Background</option>
                              <option value="video">Video Background</option>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label>Button Text</Label>
                            <Input
                              placeholder="e.g. Explore Projects"
                              value={slide.buttonText || ""}
                              onChange={(e) => {
                                const updated = [...settings.heroSlides];
                                updated[idx].buttonText = e.target.value;
                                setSettings((prev) => ({ ...prev, heroSlides: updated }));
                              }}
                            />
                          </div>

                            <div className="space-y-1 sm:col-span-2">
                              <Label>Button Target URL</Label>
                              <Input
                                placeholder="e.g. /projects or /contact"
                                value={slide.buttonUrl || ""}
                                onChange={(e) => {
                                  const updated = [...settings.heroSlides];
                                  updated[idx].buttonUrl = e.target.value;
                                  setSettings((prev) => ({ ...prev, heroSlides: updated }));
                                }}
                              />
                            </div>

                                  <div className="space-y-1 sm:col-span-2 pt-2">
                                    <ImageUploader
                                      label="Background Media (Image or Video)"
                                      description="Upload high-res photography or loop video (MP4/WebM) to Cloudinary"
                                      folder="gallery"
                                      allowVideo
                                      value={slide.image}
                                      onChange={(url) => {
                                        const updated = [...settings.heroSlides];
                                        const mediaUrl = url as string;
                                        const isVid =
                                          mediaUrl.endsWith(".mp4") ||
                                          mediaUrl.endsWith(".webm") ||
                                          mediaUrl.includes("/video/upload/");
                                        updated[idx].image = mediaUrl;
                                        if (isVid) updated[idx].mediaType = "video";
                                        setSettings((prev) => ({ ...prev, heroSlides: updated }));
                                      }}
                                    />
                                  </div>
                    </div>

                    {slide.image && (
                            <div className="h-36 w-full rounded-md border border-border overflow-hidden bg-black/10 relative">
                              {slide.mediaType === "video" ||
                                slide.image.endsWith(".mp4") ||
                                slide.image.endsWith(".webm") ||
                                slide.image.includes("/video/upload/") ? (
                                <div className="relative size-full">
                                  <video
                                    src={slide.image}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="size-full object-cover"
                                  />
                                  <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-white flex items-center gap-1">
                                    <Film className="size-3" /> Video Preview
                                  </span>
                                </div>
                              ) : (
                                <img
                                  src={slide.image}
                                  alt={slide.title}
                                  className="size-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                ))}
                      </div>
                    </TabsContent>
                  </Tabs>
        </CardContent>
            </Card>
          </form>
          );
}
