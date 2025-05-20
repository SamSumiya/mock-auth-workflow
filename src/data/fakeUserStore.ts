import { User } from "../types/user";

export const fakeUsers: Record<string, User> = {
  "emma.james@example.com": {
    firstname: "Emma",
    lastname: "James",
    email: "emma.james@example.com",
  },
  "li.chen@example.com": {
    firstname: "Li",
    lastname: "Chen",
    email: "li.chen@example.com",
  },
  "carlos.mendez@example.com": {
    firstname: "Carlos",
    lastname: "Mendez",
    email: "carlos.mendez@example.com",
  },
  "amina.khan@example.com": {
    firstname: "Amina",
    lastname: "Khan",
    email: "amina.khan@example.com",
  },
  "noah.smith@example.com": {
    firstname: "Noah",
    lastname: "Smith",
    email: "noah.smith@example.com",
  },
  "hiro.tanaka@example.com": {
    firstname: "Hiro",
    lastname: "Tanaka",
    email: "hiro.tanaka@example.com",
  },
  "olivia.brown@example.com": {
    firstname: "Olivia",
    lastname: "Brown",
    email: "olivia.brown@example.com",
  },
  "johan.nilsson@example.com": {
    firstname: "Johan",
    lastname: "Nilsson",
    email: "johan.nilsson@example.com",
  },
  "fatima.abdi@example.com": {
    firstname: "Fatima",
    lastname: "Abdi",
    email: "fatima.abdi@example.com",
  },
  "daniel.rivera@example.com": {
    firstname: "Daniel",
    lastname: "Rivera",
    email: "daniel.rivera@example.com",
  },
  "sam_sumiya@example.com": {
    firstname: "Sam",
    lastname: "Sumiya",
    email: "sam_sumiya@example.com",
  },
  "g_turner@example.com": {
    firstname: "Grace",
    lastname: "turner",
    email: "g_turner@example.com",
  },
};


// export function findUser(email: string): Promise<User | undefined> {
//   const user = fakeUsers[email]

//   if ( !user ) {
//     Promise.reject(new Error('User not found'))
//   }

//   return Promise.resolve(user)
// }