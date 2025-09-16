#!/usr/bin/env node

/**
 * NestJS GraphQL Module Generator
 * 
 * This script generates a complete NestJS module with:
 * - Entity with TypeORM and GraphQL decorators
 * - Service with CRUD operations
 * - Resolver with GraphQL queries and mutations
 * - DTOs for input validation
 * - Module configuration
 */

const fs = require('fs');
const path = require('path');

// Helper functions for string transformations
const toPascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const toKebabCase = (str) => str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
const toCamelCase = (str) => str.charAt(0).toLowerCase() + str.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
const toPlural = (str) => str.endsWith('y') ? str.slice(0, -1) + 'ies' : str + 's';

function generateModule(entityName) {
  if (!entityName) {
    console.error('❌ Please provide an entity name');
    console.log('Usage: node scripts/generate-module.js <EntityName>');
    console.log('Example: node scripts/generate-module.js Product');
    process.exit(1);
  }

  const pascalCase = toPascalCase(entityName);
  const kebabCase = toKebabCase(entityName);
  const camelCase = toCamelCase(entityName);
  const lowercase = entityName.toLowerCase();
  const plural = toPlural(lowercase);
  const pluralPascal = toPlural(pascalCase);

  const replacements = {
    'ENTITY_CLASS_NAME': pascalCase,
    'ENTITY_FILE_NAME': kebabCase,
    'ENTITY_VARIABLE_NAME': camelCase,
    'ENTITY_REPOSITORY_NAME': `${camelCase}Repository`,
    'ENTITY_NAME': lowercase,
    'ENTITY_NAME_PLURAL': plural,
    'ENTITY_TABLE_NAME': plural,
    'SERVICE_CLASS_NAME': `${pascalCase}Service`,
    'SERVICE_FILE_NAME': kebabCase,
    'SERVICE_VARIABLE_NAME': `${camelCase}Service`,
    'RESOLVER_CLASS_NAME': `${pascalCase}Resolver`,
  };

  const moduleDir = path.join('src', 'modules', kebabCase);
  const entitiesDir = path.join(moduleDir, 'entities');
  const dtoDir = path.join(moduleDir, 'dto');

  // Create directories
  [moduleDir, entitiesDir, dtoDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Template files to generate
  const templates = [
    {
      template: 'templates/entity/entity.template.ts',
      output: path.join(entitiesDir, `${kebabCase}.entity.ts`)
    },
    {
      template: 'templates/service/service.template.ts',
      output: path.join(moduleDir, `${kebabCase}.service.ts`)
    },
    {
      template: 'templates/resolver/resolver.template.ts',
      output: path.join(moduleDir, `${kebabCase}.resolver.ts`)
    },
    {
      template: 'templates/dto/create-input.template.ts',
      output: path.join(dtoDir, `create-${kebabCase}.input.ts`)
    },
    {
      template: 'templates/dto/update-input.template.ts',
      output: path.join(dtoDir, `update-${kebabCase}.input.ts`)
    }
  ];

  // Generate module file
  const moduleTemplate = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${pascalCase}Service } from './${kebabCase}.service';
import { ${pascalCase}Resolver } from './${kebabCase}.resolver';
import { ${pascalCase} } from './entities/${kebabCase}.entity';

/**
 * ${pascalCase}Module
 * 
 * This module handles all ${lowercase} related operations including:
 * - CRUD operations
 * - Business logic
 * - GraphQL resolvers
 * - Database interactions
 */
@Module({
  imports: [TypeOrmModule.forFeature([${pascalCase}])],
  providers: [${pascalCase}Service, ${pascalCase}Resolver],
  exports: [${pascalCase}Service],
})
export class ${pascalCase}Module {}`;

  fs.writeFileSync(path.join(moduleDir, `${kebabCase}.module.ts`), moduleTemplate);

  // Generate files from templates
  templates.forEach(({ template, output }) => {
    if (fs.existsSync(template)) {
      let content = fs.readFileSync(template, 'utf8');
      
      // Replace all placeholders
      Object.entries(replacements).forEach(([placeholder, value]) => {
        content = content.replace(new RegExp(placeholder, 'g'), value);
      });

      fs.writeFileSync(output, content);
      console.log(`✅ Generated: ${output}`);
    } else {
      console.warn(`⚠️  Template not found: ${template}`);
    }
  });

  console.log(`\\n🎉 Successfully generated ${pascalCase} module!`);
  console.log(`\\n📁 Generated files:`);
  console.log(`   - ${moduleDir}/${kebabCase}.module.ts`);
  console.log(`   - ${moduleDir}/${kebabCase}.service.ts`);
  console.log(`   - ${moduleDir}/${kebabCase}.resolver.ts`);
  console.log(`   - ${entitiesDir}/${kebabCase}.entity.ts`);
  console.log(`   - ${dtoDir}/create-${kebabCase}.input.ts`);
  console.log(`   - ${dtoDir}/update-${kebabCase}.input.ts`);
  
  console.log(`\\n📝 Next steps:`);
  console.log(`   1. Add ${pascalCase}Module to your app.module.ts imports`);
  console.log(`   2. Run database migration if needed`);
  console.log(`   3. Test your GraphQL queries and mutations`);
  console.log(`   4. Customize the entity fields as needed`);
}

// Get entity name from command line arguments
const entityName = process.argv[2];
generateModule(entityName);