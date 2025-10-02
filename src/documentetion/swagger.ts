import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
    title: "Klab E-commerce API",
      version: "1.0.0",
    description: "REST API for authentication, products, cart, orders, and contact",
    },
    servers: [
    { url: process.env.PUBLIC_API_BASE_URL || "http://localhost:5000" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          fullname: { type: "string" },
          email: { type: "string" },
          userRole: { type: "string", enum: ["user", "admin"] },
        },
      },
      Register: {
        type: "object",
        required: ["fullname", "email", "password"],
        properties: {
          fullname: { type: "string" },
          email: { type: "string" },
          password: { type: "string" },
          userRole: { type: "string", enum: ["user", "admin"] },
        },
      },
      Login: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string" },
        },
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          price: { type: "number" },
          category: { type: "string" },
          stock: { type: "number" },
          featured: { type: "boolean" },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          productId: { type: "string" },
          qty: { type: "number" },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
          status: { type: "string", enum: ["pending", "paid", "shipped"] },
          total: { type: "number" },
          createdAt: { type: "string" },
        },
      },
      Contact: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api-v1/users/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Register" } } },
        },
        responses: { 201: { description: "Created" }, 400: { description: "Bad Request" } },
      },
    },
    "/api-v1/users/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } },
        },
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
    },
    "/api-v1/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Products"],
        summary: "Create product",
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "Created" }, 401: { description: "Unauthorized" } },
      },
    },
    "/api-v1/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 404: { description: "Not Found" } },
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 204: { description: "No Content" } },
      },
    },
    "/api-v1/cart": {
      get: { tags: ["Cart"], summary: "Get current user's cart", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } },
    },
    "/api-v1/cart/add": {
      post: { tags: ["Cart"], summary: "Add item to cart", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } },
    },
    "/api-v1/cart/remove/{itemId}": {
      delete: {
        tags: ["Cart"],
        summary: "Remove item from cart",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "itemId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api-v1/cart/clear": {
      delete: { tags: ["Cart"], summary: "Clear cart", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } },
    },
    "/api-v1/orders/create": {
      post: { tags: ["Orders"], summary: "Create order", security: [{ bearerAuth: [] }], responses: { 201: { description: "Created" } } },
    },
    "/api-v1/orders/my-orders": {
      get: { tags: ["Orders"], summary: "Get user's orders", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } },
    },
    "/api-v1/orders/all": {
      get: { tags: ["Orders"], summary: "Get all orders (admin)", security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } },
    },
    "/api-v1/contact/create-contact": {
      post: { tags: ["Contact"], summary: "Create contact message", responses: { 201: { description: "Created" } } },
    },
  },
};

const swaggerDocs = swaggerJSDoc({ definition: swaggerDefinition, apis: [] });

export { swaggerUi, swaggerDocs };