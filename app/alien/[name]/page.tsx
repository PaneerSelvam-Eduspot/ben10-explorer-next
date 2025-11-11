'use client';
import { useParams } from 'next/navigation';
import AlienDetail from '../../components/AlienDetail';

export default function AlienPage() {
  const params = useParams();
  const name = params?.name ?? '';

  return (
    <>
    <AlienDetail paramName={name} />
    </>
  );
}