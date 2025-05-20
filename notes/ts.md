
What is Record in ts? 
Record is a utility type used to construct an object type with specific keys and a uniform value type.

```
Record<Keys, Type>
```

```
type Role = 'admin' | 'user' | 'guest';

const permissions: Record<Role: boolean> = {
    admin: true, 
    user: true, 
    guest: false 
}
```