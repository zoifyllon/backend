const ImgUpload = require('../utils/cloudStorage');
const { addHistoryRepository, getHistoriesRepository, getHistoryByIdRepository, deleteHistoryByIdRepository } = require('../repositories/histRepositories');
const { detect } = require('../service/detect');
const dataJSON = require('../../data.json');
const ATOI = require('../utils/intToString');

exports.detectController = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const imageUrl = req.file.cloudStoragePublicUrl
    const data = await detect(imageUrl)
    
    const result = await addHistoryRepository({ data: data.data, userId, imageUrl });

    res.status(201).json({
      message: 'Created',
      data: {
        id: result.history_id,
        image_url: result.image_url,
        user_id: result.user_id,
        diseases: result.diseases.map(disease => ({
          ...disease,
          percentage: disease.percentage / 100
        })),
      },
    })
  } catch (error) {
    next(error)
  }
};

exports.getHistoriesController = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const result = await getHistoriesRepository(userId);

    res.status(200).json({
      message: 'Success',
      data: result.map((data) => ({
        id: data.history_id,
        user_id: data.user_id,
        image_url: data.image_url,
        diseases: data.diseases.map(disease => ({
          ...disease,
          percentage: disease.percentage / 100
        })),
      })),
    });
  } catch (error) {
    next(error)
  }
};

exports.getHistoryByIdController = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { historyId } = req.params;

    const intHistoryId = ATOI(historyId);
    const result = await getHistoryByIdRepository(intHistoryId, userId);

    res.status(200).json({
      message: 'Success',
      data: {
        id: result.history_id,
        user_id: result.user_id,
        image_url: result.image_url,
        diseases: result.diseases.map(disease => {
          const idx = dataJSON.findIndex((d) => d.name === disease.disease);
          return ({
            ...disease,
            percentage: disease.percentage / 100,
            symptoms: dataJSON[idx].symptoms,
            prevents: dataJSON[idx].prevents
          })}
        ),
      },
    });
  } catch (error) {
    next(error)
  }
};

exports.deleteHistoryByIdController = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { historyId } = req.params;

    const intHistoryId = ATOI(historyId);
    const result = await getHistoryByIdRepository(intHistoryId, userId);
    const imageUrl = result.image_url
 
    await ImgUpload.deleteFile(imageUrl)
    await deleteHistoryByIdRepository(intHistoryId, userId)

    res.status(200).json({
      message: "success",
      data: null
    })

  } catch (error) {
    next(error)
  }
};

