const validator = requireValidator();
const TeamRepo = requireRepo("teams");
const findKeysFromRequest = requireUtil("findKeysFromRequest");
const TeamSerializer = requireSerializer("teams");

const prepare = async ({ req }) => {
  const payload = findKeysFromRequest(req, ["name", "slug", "team_uuid"]);
  payload["invoking_user_uuid"] = req.sub;
  return payload;
};

const augmentPrepare = async ({ prepareResult }) => {
  try {
    let team = await TeamRepo.first({
      uuid: prepareResult.team_uuid,
    });
    return { team };
  } catch (error) {
    throw error;
  }
};

const authorize = async ({ prepareResult, augmentPrepareResult }) => {
  if (
    augmentPrepareResult.team.creator_user_uuid ===
    prepareResult.invoking_user_uuid
  ) {
    return true;
  }

  return false;
};

const validateInput = async ({ prepareResult, augmentPrepareResult }) => {
  const constraints = {
    name: {
      presence: {
        allowEmpty: false,
        message: "^Please enter name",
      },
    },
    slug: {
      presence: {
        allowEmpty: false,
        message: "^Please enter slug",
      },
      type: "string",
      custom_callback: {
        message: "Slug should be unique",
        callback: async (payload) => {
          let count =
            typeof payload.slug === "string"
              ? await TeamRepo.countWithConstraints(
                  {
                    slug: prepareResult.slug,
                    tenant: augmentPrepareResult.team.tenant,
                  },
                  {
                    uuid: prepareResult.team_uuid,
                  }
                )
              : -1;
          return count === 0 ? true : false;
        },
      },
    },
  };

  return validator(prepareResult, constraints);
};

const handle = async ({ prepareResult, augmentPrepareResult }) => {
  try {
    await validateInput({ prepareResult, augmentPrepareResult });
    return await TeamRepo.update(prepareResult.team_uuid, {
      name: prepareResult.name,
      slug: prepareResult.slug,
    });
  } catch (error) {
    throw error;
  }
};

const respond = async ({ handleResult }) => {
  try {
    return await TeamSerializer.single(handleResult);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  prepare,
  augmentPrepare,
  authorize,
  handle,
  respond,
};
