import {
    pgTable,
    pgEnum, 
    uuid, 
    varchar, 
    timestamp,
    primaryKey,
    uniqueIndex, 
    index
} from "drizzle-orm/pg-core";

import {relations} from "drizzle-orm";


// workspace roles

export const workspaceRoleEnum = pgEnum("workspace_role", [

    "owner",
    "admin",
    "member",

]);



// Users
export const users = pgTable("users", {

    id : uuid("id").defaultRandom().primaryKey (),
    name: varchar("name",{length:255}).notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),

    // store a bcrypt hash, 
    passwordHash: varchar("password_hash", {length: 255}).notNull(),

    createdAt: timestamp("created_at", {

        withTimezone: true,
    }).defaultNow().notNull(),

    updatedAt: timestamp("updated_at", {

        withTimezone: true,
    }).defaultNow().notNull()
});


// workspace
export const workspaces = pgTable("workspaces", {

    id : uuid("id").defaultRandom().primaryKey (),
    name: varchar("name",{length:255}).notNull(),
    slug: varchar("slug", {length: 255}).notNull().unique(),

    // store a bcrypt hash, 
    passwordHash: varchar("password_hash", {length: 255}).notNull(),

    createdBy: uuid("created_by").notNull().references(() => users.id, {onDelete: "restrict"}),
  
    createdAt: timestamp("created_at", {

        withTimezone: true,
    }).defaultNow().notNull(),

    updatedAt: timestamp("updated_at", {

        withTimezone: true,
    }).defaultNow().notNull()
},
        (table) => [
            index("workspaces_created_by_idx").on(table.createdBy),
        ],
)

// Workspace members
export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role: workspaceRoleEnum("role").notNull().default("member"),

    joinedAt: timestamp("joined_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.workspaceId, table.userId],
    }),

    index("workspace_members_user_id_idx").on(table.userId),
  ]
);

// Relations for relational queries
export const userRelations = relations(users, ({many}) => ({
    memberships: many(workspaceMembers),
    createdWorkspaces: many(workspaces)
}));


export const workspaceRelations = relations(workspaces, ({one, many}) => ({
    creator: one(users, {
        fields: [workspaces.createdBy],
        references: [users.id]
    }),
    memberships: many(workspaceMembers)
}));

export const workspaceMembersRelations = relations(workspaces, ({one}) => ({
    workspace: one(workspaces, {
        fields: [workspaceMembers.workspaceId], 
        references: [workspaces.id]
    }),
    user: one(users, {
        fields: [workspaceMembers.userId],
        references: [users.id]
    }),
}));
