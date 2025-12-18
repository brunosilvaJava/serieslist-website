# Melhores Práticas - Next.js, React e PostgreSQL

## 📋 Índice

- [Next.js](#nextjs)
- [React](#react)
- [PostgreSQL](#postgresql)
- [Segurança](#segurança)
- [Performance](#performance)

## Next.js

### Estrutura de Pastas

```
/app
  /api
  /components
  /(routes)
/lib
/prisma (ou /db)
/public
/types
```

### Boas Práticas

- **Use Server Components por padrão**: Componentes do servidor são mais eficientes e reduzem o bundle do cliente
- **Client Components apenas quando necessário**: Use `'use client'` apenas para interatividade (onClick, useState, useEffect)
- **Otimize imagens**: Sempre use `next/image` para otimização automática
- **Implement ISR/SSG**: Use `revalidate` para dados que não mudam frequentemente
- **API Routes**: Mantenha lógica de negócio nas rotas API, não nos componentes

```typescript
// Exemplo: Server Component
async function Page() {
  const data = await fetchData(); // Busca direta no servidor
  return <div>{data}</div>;
}

// Exemplo: Client Component
'use client';
function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Roteamento

- Use **route groups** `(marketing)` para organização sem afetar URLs
- Implemente **loading.tsx** e **error.tsx** para melhor UX
- Use **metadata API** para SEO

## React

### Componentes

- **Single Responsibility**: Um componente deve fazer apenas uma coisa
- **Composição sobre Herança**: Prefira composição de componentes
- **Props drilling**: Evite passando props por muitos níveis (use Context ou Zustand)
- **Memorização**: Use `useMemo` e `useCallback` com moderação, apenas quando necessário

```typescript
// ❌ Evite
function HeavyComponent() {
  const value = expensiveCalculation(); // Recalcula sempre
  return <div>{value}</div>;
}

// ✅ Recomendado
function HeavyComponent() {
  const value = useMemo(() => expensiveCalculation(), []);
  return <div>{value}</div>;
}
```

### Hooks

- **Custom Hooks**: Extraia lógica reutilizável
- **Ordem dos Hooks**: Sempre chame hooks na mesma ordem
- **useEffect**: Sempre declare todas as dependências

```typescript
// Custom Hook exemplo
function useUser(id: string) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(id).then(setUser).finally(() => setLoading(false));
  }, [id]);

  return { user, loading };
}
```

### State Management

- **useState**: Para estado local simples
- **useReducer**: Para estado complexo com múltiplas ações
- **Context**: Para estado global leve
- **Zustand/Redux**: Para estado global complexo

## PostgreSQL

### Schema Design

- **Normalização**: Normalize até a 3ª forma normal, desnormalize apenas quando necessário
- **Índices**: Crie índices em colunas frequentemente consultadas
- **Foreign Keys**: Sempre use constraints de FK para integridade referencial
- **Timestamps**: Inclua `created_at` e `updated_at` em todas as tabelas

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Queries

- **Evite SELECT ***: Selecione apenas as colunas necessárias
- **Use LIMIT**: Sempre pagine resultados grandes
- **Prepared Statements**: Use para prevenir SQL Injection
- **EXPLAIN ANALYZE**: Analise queries lentas

```typescript
// ✅ Com Prisma
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  },
  where: { active: true },
  take: 10,
  skip: 0
});
```

### Migrations

- **Versionamento**: Use ferramentas como Prisma Migrate ou Knex
- **Reversível**: Sempre crie migrations reversíveis
- **Teste**: Teste migrations em ambiente de desenvolvimento primeiro
- **Backup**: Sempre faça backup antes de migrations em produção

## Segurança

### Autenticação e Autorização

- **Next-Auth.js**: Use para autenticação robusta
- **JWT**: Armazene tokens de forma segura (httpOnly cookies)
- **RBAC**: Implemente controle de acesso baseado em roles
- **Rate Limiting**: Proteja APIs contra abuso

```typescript
// Exemplo: Middleware de autenticação
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

### Validação

- **Zod**: Valide dados de entrada
- **Sanitização**: Limpe dados antes de processar
- **CORS**: Configure corretamente em produção

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

export async function POST(request: Request) {
  const body = await request.json();
  const validated = userSchema.parse(body); // Throws se inválido
  // ...
}
```

### Variáveis de Ambiente

- **Nunca commite** `.env` para o repositório
- **Use prefixo** `NEXT_PUBLIC_` para variáveis públicas
- **Validação**: Valide env vars no startup

```typescript
// lib/env.ts
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_API_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
```

## Performance

### Otimizações Next.js

- **Bundle Analyzer**: Analise o tamanho do bundle regularmente
- **Dynamic Imports**: Carregue componentes pesados dinamicamente
- **Prefetch**: Use `<Link prefetch>` estrategicamente
- **CDN**: Use para assets estáticos

```typescript
// Dynamic import
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false // Desabilite SSR se não necessário
});
```

### Otimizações PostgreSQL

- **Connection Pooling**: Use PgBouncer ou Prisma connection pool
- **Índices Compostos**: Para queries com múltiplos filtros
- **Materialized Views**: Para queries complexas e frequentes
- **Particionamento**: Para tabelas muito grandes

```typescript
// Prisma connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}?connection_limit=10&pool_timeout=20`
    }
  }
});
```

### Cache

- **Redis**: Para cache de dados frequentes
- **Next.js Cache**: Use `unstable_cache` para Server Components
- **SWR/React Query**: Para cache no cliente

```typescript
import { unstable_cache } from 'next/cache';

const getUser = unstable_cache(
  async (id: string) => {
    return await prisma.user.findUnique({ where: { id } });
  },
  ['user-by-id'],
  { revalidate: 3600 } // 1 hora
);
```

## 🔍 Ferramentas Recomendadas

- **Prisma**: ORM moderno para PostgreSQL
- **Zod**: Validação de schemas
- **NextAuth.js**: Autenticação
- **Zustand**: State management leve
- **SWR/React Query**: Fetch e cache de dados
- **ESLint + Prettier**: Linting e formatação
- **TypeScript**: Tipagem estática

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides)

---

**Última atualização**: 2024
