import { NewPostPipe } from './new-post.pipe';

describe('NewPostPipe', () => {
  it('create an instance', () => {
    const pipe = new NewPostPipe();
    expect(pipe).toBeTruthy();
  });
});
