import { atomWithStorage } from 'jotai/utils';
import { Profile } from '~/domain/persona';

export const profileAtom = atomWithStorage<Profile | null>('profile', null);

export const personaAtom = atomWithStorage<string | null>('persona', null);
