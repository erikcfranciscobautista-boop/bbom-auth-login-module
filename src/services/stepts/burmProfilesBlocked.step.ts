import {
    AuthLoginLogger,
    PatchBurmProfilesBlockedPort
} from '../../contract/authLogin.contract.js';

interface JStepBurmProfilesBlockedOptions {
    burmUserId: string;
    patchBurmProfilesBlocked: PatchBurmProfilesBlockedPort;
    logger: AuthLoginLogger;
}

export async function jstepBurmProfilesBlocked(options: JStepBurmProfilesBlockedOptions) {
    const { burmUserId, patchBurmProfilesBlocked, logger } = options;

    logger.info?.('step : burmProfilesBlocked');
    try {
        await patchBurmProfilesBlocked(burmUserId);
    } catch (error) {
        // El bloqueo es best-effort para esta fase: siempre termina retornando error generico.
        logger.warn?.('warn - [burmProfilesBlocked] : failed to block profile', error);
    }
}