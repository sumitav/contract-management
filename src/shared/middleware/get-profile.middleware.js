import cache from '../cache/node.cache.js';

import { Profile } from '../../modules/index.js';

const getProfile = async (req, res, next) => {
    const profileId = req.get('profile_id') || 0;
    const cacheKey = `profile-${profileId}`;

    const cachedData = cache.get(cacheKey);

    let profile = cachedData;

    if (!cachedData) {
        profile = await Profile.findOne({
            where: { id: profileId }
        });
    }

    if (!profile) return res.status(401).end();

    const oneHourInSeconds = 3600;

    cache.set(cacheKey, profile, oneHourInSeconds);

    req.profile = profile.dataValues;

    next();
};

export { getProfile }