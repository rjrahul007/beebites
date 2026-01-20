"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Upload, X, Trash2, Image, Loader2, Search, Edit } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

type MenuItem = {
  id: string;
  name: string;
  price: number | null;
  category_id: string | null;
  image_url: string | null;
  category?: { id: string; name: string };
};

type Category = {
  id: string;
  name: string;
  slug?: string;
};

type FormState = {
  name: string;
  price: string;
  category_id: string | null;
  image_url: string | null;
};

type AdminRole = "ADMIN" | "KITCHEN";

/* ---------------- COMPONENT ---------------- */

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    category_id: null,
    image_url: null,
  });

  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- CLIENT ROLE GUARD ---------------- */

  /* ---------------- DATA FETCH ---------------- */

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/menu/items");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Failed to load items", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  /* ---------------- FILTERING ---------------- */

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category?.name.toLowerCase().includes(q),
    );
  }, [items, searchQuery]);

  /* ---------------- IMAGE UPLOAD (MOCKED) ---------------- */

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return null;
    }

    try {
      setUploading(true);

      const reader = new FileReader();
      return new Promise<string | null>((resolve) => {
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setForm((s) => ({ ...s, image_url: dataUrl }));
          resolve(dataUrl);
        };
        reader.readAsDataURL(file);
      });
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- DRAG & DROP ---------------- */

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) await uploadImage(file);
  };

  /* ---------------- CRUD ---------------- */

  const handleCreate = async () => {
    const payload = {
      ...form,
      price: form.price === "" ? null : Number(form.price),
    };

    const res = await fetch("/api/admin/menu/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      handleClear();
      await fetchItems();
    } else {
      alert("Failed to create item");
    }
  };

  const handleUpdate = async () => {
    const payload = {
      ...form,
      price: form.price === "" ? null : Number(form.price),
    };

    const res = await fetch("/api/admin/menu/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, ...payload }),
    });

    if (res.ok) {
      handleClear();
      await fetchItems();
    } else {
      alert("Failed to update item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;

    const res = await fetch("/api/admin/menu/items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      await fetchItems();
    } else {
      alert("Failed to delete item");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      price: item.price != null ? String(item.price) : "",
      category_id: item.category_id,
      image_url: item.image_url,
    });
  };

  const handleClear = () => {
    setEditingId(null);
    setForm({ name: "", price: "", category_id: null, image_url: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isFormValid =
    form.name.trim().length > 0 &&
    form.price !== "" &&
    Boolean(form.category_id);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">Admin — Menu</h1>

        {/* Form Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Item" : "Create Item"}</CardTitle>
              {editingId && (
                <Button
                  onClick={handleClear}
                  variant="ghost"
                  size="icon"
                  type="button"
                  title="Cancel"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column - Form Fields */}
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Select
                    value={form.category_id || ""}
                    onValueChange={(v) =>
                      setForm({ ...form, category_id: v || null })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {form.image_url ? (
                    <div className="relative group">
                      <img
                        src={form.image_url}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        onClick={() => setForm({ ...form, image_url: null })}
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        type="button"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) await uploadImage(f);
                        }}
                        className="hidden"
                      />
                      {uploading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Uploading...
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-muted mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Choose File
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            No file chosen
                          </p>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              {editingId ? (
                <>
                  <Button
                    onClick={handleUpdate}
                    disabled={!isFormValid || uploading}
                    type="button"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant={"outline"}
                    type="button"
                  >
                    Clear
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleCreate}
                    disabled={!isFormValid || uploading}
                    type="button"
                  >
                    Create
                  </Button>
                  <Button onClick={handleClear} variant="outline" type="button">
                    Clear
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Items List Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <CardTitle>Items</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Image className="w-12 h-12 text-muted mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No items match your search" : "No items yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-12 h-12 rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                                <Image className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-foreground">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {item.price?.toFixed(0) || "0"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {item.category?.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => handleEdit(item)}
                              variant="outline"
                              size="sm"
                              type="button"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(item.id)}
                              variant="destructive"
                              size="sm"
                              type="button"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
