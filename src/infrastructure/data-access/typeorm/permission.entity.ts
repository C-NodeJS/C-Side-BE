import { ObjectModel } from './object.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PermissionAction } from 'src/application/casl/action.constant';
import { json } from 'stream/consumers';
import { RoleModel } from './role.entity';

@Entity({ name: 'permissions' })
export class PermissionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PermissionAction,
    default: PermissionAction.READ,
  })
  action: PermissionAction;

  @Column({ name: 'object_id' })
  objectId: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  condition?: string;

  @ManyToOne(() => ObjectModel, (object) => object.permissions)
  @JoinColumn({ name: 'object_id' })
  object: ObjectModel;

  @ManyToMany(() => RoleModel, (role) => role.permissions)
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RoleModel;

  static parseCondition(condition, user) {
    if (!condition) return null;
    const result = {};
    for (const key in condition) {
      result[key] = user[condition[key]];
    }
    return result;
  }
}
