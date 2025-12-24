'use client';
import { useParams } from 'next/navigation';
import AlienDetail from '../../components/AlienDetail';

export default function AlienPage() {
  const params = useParams();
  return <AlienDetail name={params.name} />;
}
