'use client';

import { useState } from 'react';
import Link from 'next/link';
import RichTextEditor from './RichTextEditor';
import { ApiError } from '@/lib/api';
import { EMPLOYMENT_LABEL, EXPERIENCE_LABEL, LOCATIONS, POSITIONS } from '@/lib/format';
import type { EmploymentType, ExperienceLevel, VacancyInput } from '@/lib/types';

const TEMPLATE =
  '<h2>Deskripsi Pekerjaan</h2><p>Sebagai [Posisi Lowongan], Anda akan terlibat dalam proses pengembangan aplikasi yang dibutuhkan oleh [Nama Perusahaan]. Anda juga diharapkan mampu bekerja dalam tim.</p><h2>Tanggung Jawab</h2><ul><li>Membuat atau memodifikasi program yang sudah ada.</li><li>Bertanggung jawab dalam mengelola program.</li></ul>';

export type FormState = {
  title: string;
  position: string;
  employment_type: EmploymentType | '';
  candidates_needed: string;
  active_until: string;
  location: string;
  is_remote: boolean;
  description: string;
  salary_min: string;
  salary_max: string;
  show_salary: boolean;
  min_experience: ExperienceLevel | '';
};

const EMPTY: FormState = {
  title: '',
  position: '',
  employment_type: '',
  candidates_needed: '',

  active_until: '',
  location: '',
  is_remote: false,
  description: TEMPLATE,
  salary_min: '',
  salary_max: '',
  show_salary: false,
  min_experience: '',
};

const inputCls =
  'w-full rounded-[4px] border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500';

const isEmptyHtml = (html: string) => html.replace(/<[^>]*>/g, '').trim() === '';

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id?: string;
  label: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}

      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error[0]}
        </p>
      )}
    </div>
  );
}

function Radios<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T | '';
  options: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label={name}>
      {(Object.keys(options) as T[]).map((key) => (
        <label key={key} className="flex items-center gap-2 text-sm">
          <input type="radio" name={name} value={key} checked={value === key} onChange={() => onChange(key)} required />
          {options[key]}
        </label>
      ))}
    </div>

  );
}

type Props = {
  initial?: Partial<FormState>;
  isEdit?: boolean;
  submitLabel: string;
  onSubmit: (payload: Partial<VacancyInput>) => Promise<void>;
};

export default function JobForm({ initial, isEdit = false, submitLabel, onSubmit }: Props) {
  const [f, setF] = useState<FormState>({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setFormError('');

    if (isEmptyHtml(f.description)) {
      setErrors({ description: ['Deskripsi wajib diisi.'] });
      return;
    }

    setPending(true);
    const payload: Partial<VacancyInput> = {
      title: f.title,
      position: f.position,

      employment_type: f.employment_type as EmploymentType,
      candidates_needed: Number(f.candidates_needed),
      active_until: f.active_until,
      location: f.location,
      is_remote: f.is_remote,
      description: f.description,
      show_salary: f.show_salary,
      min_experience: f.min_experience as ExperienceLevel,
    };
    if (f.salary_min !== '') payload.salary_min = Number(f.salary_min);
    if (f.salary_max !== '') payload.salary_max = Number(f.salary_max);
    else if (!isEdit) payload.salary_max = null;

    try {
      await onSubmit(payload);
    } catch (err) {
      if (err instanceof ApiError && err.errors) setErrors(err.errors);
      else setFormError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-[640px] space-y-7 px-6 py-10">
      <Field id="title" label="Judul lowongan *" hint="Contoh: Android Native Developer" error={errors.title}>
        <input id="title" className={inputCls} required value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="Masukkan judul lowongan" />
      </Field>

      <Field id="position" label="Posisi *" error={errors.position}>
        <select id="position" className={inputCls} required value={f.position} onChange={(e) => set('position', e.target.value)}>
          <option value="">Pilih posisi yang dicari</option>

          {POSITIONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>

      <Field label="Tipe pekerjaan *" error={errors.employment_type}>
        <Radios name="employment_type" value={f.employment_type} options={EMPLOYMENT_LABEL} onChange={(v) => set('employment_type', v)} />
      </Field>

      <Field id="candidates_needed" label="Kandidat yang dibutuhkan *" error={errors.candidates_needed}>
        <input id="candidates_needed" type="number" min={1} className={inputCls} required value={f.candidates_needed} onChange={(e) => set('candidates_needed', e.target.value)} placeholder="Masukkan jumlah kandidat yang dibutuhkan" />
      </Field>

      <Field id="active_until" label="Aktif hingga *" error={errors.active_until}>
        <input id="active_until" type="date" className={inputCls} required value={f.active_until} onChange={(e) => set('active_until', e.target.value)} />
      </Field>

      <Field id="location" label="Lokasi *" error={errors.location}>
        <select id="location" className={inputCls} required value={f.location} onChange={(e) => set('location', e.target.value)}>
          <option value="">Pilih lokasi</option>
          {LOCATIONS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.is_remote} onChange={(e) => set('is_remote', e.target.checked)} />
          Bisa remote
        </label>
      </Field>

      <Field label="Deskripsi *" hint="Anda bisa mengubah templat yang telah disediakan di atas." error={errors.description}>

        <RichTextEditor value={f.description} onChange={(html) => set('description', html)} />
      </Field>

      <Field
        label="Rentang gaji per bulan *"
        hint={isEdit ? 'Kosongkan untuk mempertahankan gaji yang tersimpan.' : 'Anda tidak perlu mengisi kolom "Maksimum" jika gaji yang ditawarkan adalah gaji pokok.'}
        error={errors.salary_min ?? errors.salary_max}
      >
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center rounded-[4px] border border-slate-200 px-3 text-sm">
            Rp
            <input aria-label="Gaji minimum" type="number" min={0} className="w-full py-2.5 pl-2 outline-none" required={!isEdit} value={f.salary_min} onChange={(e) => set('salary_min', e.target.value)} placeholder="Minimum" />
          </div>
          <span>-</span>
          <div className="flex flex-1 items-center rounded-[4px] border border-slate-200 px-3 text-sm">
            Rp
            <input aria-label="Gaji maksimum" type="number" min={0} className="w-full py-2.5 pl-2 outline-none" value={f.salary_max} onChange={(e) => set('salary_max', e.target.value)} placeholder="Maksimum (opsional)" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <button
            type="button"
            role="switch"
            aria-checked={f.show_salary}
            aria-label="Tampilkan gaji"
            onClick={() => set('show_salary', !f.show_salary)}
            className={`relative h-5 w-9 rounded-full transition ${f.show_salary ? 'bg-[#2b3a4e]' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${f.show_salary ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
          Tampilkan gaji
        </div>

        <p className="text-xs text-slate-500">Gaji akan ditampilkan di lowongan pekerjaan dan dapat dilihat oleh kandidat.</p>
      </Field>

      <Field label="Minimal pengalaman bekerja *" error={errors.min_experience}>
        <Radios name="min_experience" value={f.min_experience} options={EXPERIENCE_LABEL} onChange={(v) => set('min_experience', v)} />
      </Field>

      {formError && (
        <p role="alert" className="text-sm text-red-600">
          {formError}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="rounded-[4px] bg-[#2b3a4e] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {pending ? 'Menyimpan...' : submitLabel}
        </button>
        <Link href="/dashboard" className="rounded-[4px] border border-slate-200 px-5 py-2.5 text-sm">
          Batal
        </Link>
      </div>
    </form>
  );
}