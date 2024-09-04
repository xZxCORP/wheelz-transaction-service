import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createZodSchema, ZodValidator } from '../zod.validator.js'

describe('ZodValidator', () => {
  const basicZodSchema = z.object({ name: z.string() })
  const schema = createZodSchema(basicZodSchema)

  it('should validate with good data', () => {
    const validator = new ZodValidator()
    expect(validator.validate(schema, { name: 'John' }).isOk()).toBe(true)
  })
  it('should reject with bad data', () => {
    const validator = new ZodValidator()
    expect(validator.validate(schema, { nae: 'John' }).isErr()).toBe(true)
  })
})
