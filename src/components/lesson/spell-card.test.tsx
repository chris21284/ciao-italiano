import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Exercise } from '@/lib/exercise-builder';
import { SpellCard } from './spell-card';

const exercise: Exercise = {
  kind: 'spell',
  word: { id: 'rosso', it: 'rosso', fr: 'rouge', emoji: '🔴', say: 'rosso' },
  letters: ['s', 's', 'r', 'o', 'o'],
};

function letters() {
  return screen.getAllByRole('button').filter((button) => button.textContent?.length === 1);
}

/** Le mot en cours d'assemblage : la zone annoncée aux lecteurs d'écran. On la
 *  vise explicitement, sinon « r » désigne aussi la touche « r ». */
function assembled() {
  return document.querySelector('[aria-live="polite"]')?.textContent;
}

describe('SpellCard', () => {
  it('assemble le mot dans l’ordre des lettres touchées', async () => {
    const user = userEvent.setup();
    render(<SpellCard exercise={exercise} answered={false} onAnswer={vi.fn()} />);

    const [s1, , r, o1] = letters();
    await user.click(r as HTMLElement);
    await user.click(o1 as HTMLElement);
    await user.click(s1 as HTMLElement);

    expect(assembled()).toBe('ros');
  });

  it('efface la dernière lettre sans valider la réponse', async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(<SpellCard exercise={exercise} answered={false} onAnswer={onAnswer} />);

    const [, , r, o1] = letters();
    await user.click(r as HTMLElement);
    await user.click(o1 as HTMLElement);
    await user.click(screen.getByLabelText('Effacer la dernière lettre'));

    expect(assembled()).toBe('r');
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it('rend sa lettre au clavier quand on l’efface', async () => {
    const user = userEvent.setup();
    render(<SpellCard exercise={exercise} answered={false} onAnswer={vi.fn()} />);

    const [, , r] = letters();
    await user.click(r as HTMLElement);
    expect(r).toHaveAttribute('data-used', 'true');

    await user.click(screen.getByLabelText('Effacer la dernière lettre'));
    expect(r).toHaveAttribute('data-used', 'false');
  });

  it('garde le bouton d’effacement inactif tant que rien n’est posé', () => {
    render(<SpellCard exercise={exercise} answered={false} onAnswer={vi.fn()} />);
    expect(screen.getByLabelText('Effacer la dernière lettre')).toBeDisabled();
  });
});
