'use client';
import { useParams } from 'next/navigation';
import AlienDetail from '../../components/AlienDetail';

export default function AlienPage() {
  const params = useParams();
  const name = Array.isArray(params.name) ? params.name[0] : params.name ?? '';

  return <AlienDetail name={name} />;
}
