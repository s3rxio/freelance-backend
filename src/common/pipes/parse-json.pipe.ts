import {
  Injectable,
  PipeTransform,
  Optional,
  HttpStatus
} from "@nestjs/common";
import {
  ErrorHttpStatusCode,
  HttpErrorByCode
} from "@nestjs/common/utils/http-error-by-code.util";
import { isJSON } from "class-validator";

export interface ParseJsonPipeOptions {
  throwInvalidError?: boolean;
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

@Injectable()
export class ParseJsonPipe implements PipeTransform<string> {
  private throwInvalidError: boolean;
  private exceptionFactory: (error: string) => any;

  constructor(@Optional() options?: ParseJsonPipeOptions) {
    options = options || {};

    const {
      exceptionFactory,
      errorHttpStatusCode = HttpStatus.BAD_REQUEST,
      throwInvalidError = false
    } = options;

    this.throwInvalidError = throwInvalidError;
    this.exceptionFactory =
      exceptionFactory ||
      (error => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  async transform(value: string) {
    const isJson = isJSON(value);

    if (!isJson) return {};
    if (this.throwInvalidError) {
      throw this.exceptionFactory(
        "Validation failed (JSON string is expected)"
      );
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      console.log("Json Parser Error:", e);
    }
  }
}
