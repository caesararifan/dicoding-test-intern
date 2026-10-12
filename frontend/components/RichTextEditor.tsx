'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from 'lucide-react';

type Props = { value: string; onChange: (html: string) => void };

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? '' : editor.getHTML()),
    editorProps: {
      attributes: {
        'data-testid': 'description-editor',
        class:
          'min-h-[260px] max-h-[360px] overflow-y-auto px-4 py-3 text-sm leading-6 outline-none [&_a]:text-blue-600 [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5',
      },
    },
  });


  if (!editor) return <div className="h-72 animate-pulse rounded-md bg-slate-100" />;

  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL tautan', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const tools = [
    { label: 'Judul', icon: Heading2, active: editor.isActive('heading', { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Tebal', icon: Bold, active: editor.isActive('bold'), run: () => editor.chain().focus().toggleBold().run() },
    { label: 'Miring', icon: Italic, active: editor.isActive('italic'), run: () => editor.chain().focus().toggleItalic().run() },
    { label: 'Garis bawah', icon: UnderlineIcon, active: editor.isActive('underline'), run: () => editor.chain().focus().toggleUnderline().run() },
    { label: 'Tautan', icon: LinkIcon, active: editor.isActive('link'), run: setLink },
    { label: 'Daftar poin', icon: List, active: editor.isActive('bulletList'), run: () => editor.chain().focus().toggleBulletList().run() },
    { label: 'Daftar angka', icon: ListOrdered, active: editor.isActive('orderedList'), run: () => editor.chain().focus().toggleOrderedList().run() },
  ];

  return (
    <div className="rounded-[4px] border border-slate-200 bg-white focus-within:border-slate-500">
      <div className="flex gap-1 border-b border-slate-200 p-1.5">
        {tools.map(({ label, icon: Icon, active, run }) => (
          <button
            key={label}
            type="button"
            title={label}

            aria-label={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={run}
            className={`grid h-7 w-7 place-items-center rounded ${active ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}