import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  
  return {
    user: {
      name: 'Sbongakonke Langalibalele',
      email: 'admin@acme-fs.demo',
    },
    userRoles: ['Admin'],
    company: 'Acme Financial Services',
    permissions: ['*'],
    logout: () => {
      // Clear auth state
      router.push('/login');
    },
  };
}
