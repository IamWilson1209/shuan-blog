import Link from 'next/link';
import Image from 'next/image';
import { auth, signOut, signIn } from '@/auth';
import { Plus, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-md font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/Ex-black.png" alt="logo" width={72} height={15} />
        </Link>

        <div className="flex items-center text-black">
          <Button variant="ghost" className="max-md:hidden" asChild>
            <Link href="/author">
              <p className="bg-white p-2 text-16-medium hover:bg-black-100 hover:text-white-100 transition-colors duration-300">
                Contact me
              </p>
            </Link>
          </Button>
          <p className="max-md:hidden">|</p>
          <Button variant="ghost" className="max-md:hidden" asChild>
            <Link href="/about">
              <p className="bg-white p-2 text-16-medium hover:bg-black-100 hover:text-white-100 transition-colors duration-300">
                About Ex*
              </p>
            </Link>
          </Button>
          {session && session?.user ? (
            <>
              <Link href={`/articles/create`}>
                <Button className="create-button max-md:hidden">Create</Button>
                <Plus className="size-8 mx-2 bg-black-200 text-white-100 rounded-full p-1 border-black hover:bg-zinc-100 hover:text-black-200 md:hidden transition-colors duration-500" />
              </Link>

              <form
                action={async () => {
                  'use server';

                  await signOut({ redirectTo: '/' });
                }}
              >
                <button type="submit">
                  <LogOut className="size-8 mx-2 md:hidden text-red-800 mt-2" />
                </button>
                <Button className="logout-button max-md:hidden">Logout</Button>
              </form>

              <Link href={`/users/${session?.id}`}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user?.image || ''}
                    alt={session?.user?.name || ''}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                'use server';

                await signIn('github');
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
