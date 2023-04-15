import { BadRequestException } from '@nestjs/common';

function MinLength(min: number) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    target.validators = {
      minLength: function (args: string[]) {
        return args[parameterIndex].length >= min;
      },
    };
    target.test = 'abc';
  };
}

function Validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(target.test);
    Object.keys(target.validators).forEach((key) => {
      if (!target.validators[key](args)) {
        throw new BadRequestException();
      }
    });
    method.apply(this, args);
  };
}

class User {
  private name: string;

  @Validate
  setName(@MinLength(3) name: string) {
    this.name = name;
  }
}

const t = new User();
t.setName('Dexter');
console.log('----------');
t.setName('De');
