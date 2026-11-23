"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  value,
  onChange,
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] w-full rounded-b-lg border-t-0 bg-transparent px-4 py-3 text-sm focus:outline-none leading-relaxed prose prose-sm max-w-none [&_h1]:text-xl [&_h1]:font-black [&_h1]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when value changes externally (e.g. initial load or reset)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[220px] rounded-lg border border-input p-4 text-xs text-muted-foreground animate-pulse">
        Loading editor...
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-input bg-card shadow-xs overflow-hidden", className)}>
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("bold") && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Bold"
        >
          <Bold className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("italic") && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Italic"
        >
          <Italic className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-0.5" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("heading", { level: 1 }) && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Heading 1"
        >
          <Heading1 className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("heading", { level: 2 }) && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Heading 2"
        >
          <Heading2 className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("heading", { level: 3 }) && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Heading 3"
        >
          <Heading3 className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-0.5" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("bulletList") && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Bullet List"
        >
          <List className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("orderedList") && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Numbered List"
        >
          <ListOrdered className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("blockquote") && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Blockquote"
        >
          <Quote className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors",
            editor.isActive("codeBlock") && "bg-background text-navy-950 font-bold shadow-2xs"
          )}
          title="Code Block"
        >
          <Code className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 transition-colors"
          title="Horizontal Rule"
        >
          <Minus className="size-3.5" />
        </button>

        <div className="h-4 w-px bg-border mx-0.5 ml-auto" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 disabled:opacity-30 transition-colors"
          title="Undo"
        >
          <Undo className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="rounded p-1.5 text-xs hover:bg-muted text-muted-foreground hover:text-navy-900 disabled:opacity-30 transition-colors"
          title="Redo"
        >
          <Redo className="size-3.5" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
