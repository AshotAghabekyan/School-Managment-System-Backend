import { randomBytes, pbkdf2Sync } from "crypto";


export class CryptoHasher {
  private readonly SALT_LENGTH = 16;
  private readonly ITERATIONS = 100000;
  private readonly KEY_LENGTH = 64;
  private readonly DIGEST = "sha256";


  public hash(value: string): string {
    const salt = randomBytes(this.SALT_LENGTH).toString("hex");
    const hash = pbkdf2Sync(value, salt, this.ITERATIONS, this.KEY_LENGTH, this.DIGEST).toString("hex");
    return `${salt}:${hash}`;
  }

  public verify(value: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(":");
    const hash = pbkdf2Sync(value, salt, this.ITERATIONS, this.KEY_LENGTH, this.DIGEST).toString("hex");
    return hash == originalHash;
  }
}
