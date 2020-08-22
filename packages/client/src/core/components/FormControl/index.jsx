import React, { useRef, forwardRef } from 'react';
import { v4 as uuid } from 'uuid';

import { Flex } from '@core/components/Flex';
import { Label } from '@core/components/Label';
import { FormError } from '@core/components/FormError';

export const FormControl = forwardRef(
  ({ label, component: Component, name, error, children, ...props }, ref) => {
    const id = useRef(uuid());

    return (
      <Flex direction="column">
        <Label htmlFor={id.current}>{label}</Label>
        {children ? (
          children({ id })
        ) : (
          <Component {...props} name={name} ref={ref} id={id.current} />
        )}
        <FormError>{error?.message}</FormError>
      </Flex>
    );
  }
);
