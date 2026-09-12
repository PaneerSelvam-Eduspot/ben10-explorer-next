'use client';
import AlienDetail from '@/app/components/aliens/AlienDetail';
import { useParams } from 'next/navigation';

export default function AlienPage() {
  const params = useParams();
  const name = Array.isArray(params.name) ? params.name[0] : params.name ?? '';

  return <AlienDetail name={name} />;
}
