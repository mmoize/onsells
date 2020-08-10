import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newPost'
})
export class NewPostPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
