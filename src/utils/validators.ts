import { ValidationError } from "@src/infra/errors";

export function isUuid(uuid: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    uuid,
  );
}

export function validator({
  id,
  callback = () => false,
  errorMessage,
}: {
  id: string;
  callback?: (id: string) => boolean;
  errorMessage?: string;
}) {
  if (!id || !callback(id))
    throw new ValidationError({ message: errorMessage || "Invalid id" });
}
