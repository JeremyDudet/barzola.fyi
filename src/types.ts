export interface User {
  id: string
  firstName: string
  lastName: string
  alias: string | null
  password: string
  auth: string
}

export interface NewUser {
  firstName: string
  lastName: string
  alias: string | null
  password: string
  auth: string
}

export interface Task {
  id: string
  name: string
  description: string
  taskPriorityId: string
  roleId: string
  status: string
}

export interface NewTask {
  name: string
  description: string
  taskPriorityId: string
  roleId: string
  status: string
}

export interface Day {
  id: string
  startingCovers: number
  endingCovers: number
  date: Date
  totalSales: number
  peopleStaffed: User[]
  tasksCompleted: Task[]
}

export interface Priority {
  id: string
  name: string
  description: string
}

export interface Role {
  id: string
  name: string
  description: string
  department: Department
}

export interface NewRole {
  name: string
  description: string
  department: Department
}

export interface Department {
  id: string
  name: string
  description: string
}

export interface NewDepartment {
  name: string
  description: string
}

export interface JuiceRequest {
  id: string
  requestFromId: string
  lemonAmount: number
  orangeAmount: number
  grapefruitAmount: number
  notes: string | null
  createdAt: Date
  lastEdited: Date
}

export interface NewJuiceRequest {
  requestFromId: string
  lemonAmount: number
  orangeAmount: number
  grapefruitAmount: number
  notes: string | null
}

export interface JuiceRequestUpdate {
  id: string
  lemonAmount: number
  orangeAmount: number
  grapefruitAmount: number
  notes: string | null
}

export interface Allergen {
  id: string
  name: string
  description: string | null
  createdAt: Date
  lastEdited: Date
}

export interface Component {
  id: string
  name: string
  description: string
  removable: boolean
  allergens?: Allergen[]
  dish: Dish
  dishId: string
}

export interface Dish {
  id: string
  name: string
  description: string
  advertisedDescription: string
  price: number
  menu: Menu | null
  menuSection: MenuSection | null
  allergens?: Allergen[]
  lastEdited?: Date
  lastEditedById: string
  imageId: string
}

export interface NewDish {
  name: string
  description: string
  advertisedDescription: string
  price: number
  allergens: string[] | undefined
  imageId: string
  lastEditedById: string
}

export interface MenuSection {
  id: string
  name: string
  menuId: string
  arrangementInMenu: number
  lastEdited: Date
  createdAt: Date
}

export interface Menu {
  forEach(arg0: (menu: Menu, index?: number) => void): unknown
  length: number
  id: string
  name: string
  description: string
  dishes?: Dish[]
  menuSection?: MenuSection[]
}

// model JuiceRequest {
//   id                String   @id @default(cuid())
//   requestFrom       User     @relation(name: "UserOnRequest", fields: [requestFromId], references: [id])
//   requestFromId     String
//   lemonAmount       Float
//   orangeAmount      Float
//   grapefruitAmount  Float
//   notes             String?
//   createdAt         DateTime @default(now())
//   lastEdited        DateTime @updatedAt
// }
