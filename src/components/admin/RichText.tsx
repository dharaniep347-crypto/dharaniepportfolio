import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Heading3, Undo, Redo } from "lucide-react";

export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-40 px-3 py-2 focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:font-bold [&_h3]:text-lg [&_p]:my-1",
        "aria-label": "Project description",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value);
  }, [value, editor]);
  if (!editor) return <div className="min-h-48 rounded-md border-2" />;
  const btn = (label: string, active: boolean, run: () => void, Icon: typeof Bold) => (
    <button type="button" aria-label={label} aria-pressed={active} onClick={run}
      className={`rounded p-1.5 ${active ? "bg-raised text-paper" : "hover:bg-muted"}`}>
      <Icon className="size-4" />
    </button>
  );
  return (
    <div className="rounded-md border-2 bg-card">
      <div className="flex gap-1 border-b p-1">
        {btn("Bold", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), Bold)}
        {btn("Italic", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), Italic)}
        {btn("Heading", editor.isActive("heading"), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), Heading3)}
        {btn("Bullet list", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), List)}
        {btn("Numbered list", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered)}
        {btn("Undo", false, () => editor.chain().focus().undo().run(), Undo)}
        {btn("Redo", false, () => editor.chain().focus().redo().run(), Redo)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
