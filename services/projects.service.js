const ProjectStatus = require("../models/ProjectStatus");
const Project = require("../models/Projects");
const Technology = require("../models/Technology");
const technologiesService = require("./technologies.service");
const uploadService = require("./upload.service");
const escapeRegex = require("../utils/escapeRegex");
const ApiError = require("../utils/ApiError");


const projectPopulate = [
	{ path: "status", select: "code title" },
	{
		path: "tech",
		select: "name slug icon website category",
		populate: { path: "category", select: "name slug color icon" },
	},
];

// Публичный и админский список отличаются только тем, что публичный
// всегда добавляет is_public: true к фильтру — вся остальная логика
// сборки фильтра общая, поэтому вынесена в один хелпер.
const buildFilter = async ({ search, status, tech, favorite }, { onlyPublic }) => {
	const filter = onlyPublic ? { is_public: true } : {};

	if (status) {
		const statusExists = await ProjectStatus.findOne({ code: status });
		if (statusExists) {
			filter.status = statusExists._id;
		}
	}

	// Query-параметры всегда приходят строками, поэтому явно приводим к boolean
	if (favorite !== undefined) {
		filter.favorite = favorite === "true";
	}

	if (tech) {
		filter.tech = { $all: Array.isArray(tech) ? tech : [tech] };
	}

	if (search) {
		const safeSearch = escapeRegex(search);
		filter.$or = [
			{ title: { $regex: safeSearch, $options: "i" } },
			{ short_description: { $regex: safeSearch, $options: "i" } },
		];
	}

	return filter;
};

const getProjects = async (query) => {
	const filter = await buildFilter(query, { onlyPublic: true });

	return Project.find(filter)
		.populate(projectPopulate)
		.sort({ favorite: -1, createdAt: -1 });
};

const getProjectsByAdmin = async (query) => {
	const filter = await buildFilter(query, { onlyPublic: false });

	return Project.find(filter)
		.populate(projectPopulate)
		.sort({ favorite: -1, createdAt: -1 });
};

const getProjectBySlug = async (slug) => {
	return Project.findOne({ slug, is_public: true }).populate(projectPopulate);
};

const getProjectById = async (projectId) => {
	const project = await Project.findById(projectId)
		.populate(projectPopulate);

	if (!project) {
		throw new ApiError(
			404,
			"PROJECT_NOT_FOUND",
			"Проект не найден"
		);
	}

	return project;
};

const getStatusOptions = async () => {
	return ProjectStatus.find({ isActive: true }).sort({ order: 1 });
};

const createProject = async (data) => {
	const status = await ProjectStatus.findOne({ _id: data.status });

	if (!status) {
		throw new ApiError(
			400,
			"PROJECT_STATUS_NOT_FOUND",
			"Указанный статус не существует"
		);
	}

	await technologiesService.validateTechnologies(data.tech);

	const project = await Project.create({ ...data, status: status._id });

	return Project.findById(project._id).populate(projectPopulate);
};

const updateProject = async (projectId, projectData) => {
	if (projectData.status) {
		const status = await ProjectStatus.findOne({ _id: projectData.status });

		if (!status) {
			throw new ApiError(
				400,
				"PROJECT_STATUS_NOT_FOUND",
				"Указанный статус не существует"
			);
		}

		projectData = { ...projectData, status: status._id };
	}

	const project = await Project.findById(projectId);

	if (!project) {
		throw new ApiError(
			404,
			"PROJECT_NOT_FOUND",
			"Проект не найден"
		);
	}

	// Если пришла новая картинка — удаляем старую с диска
	if (projectData.image_url && project.image_url && project.image_url !== projectData.image_url) {
		await uploadService.deleteFile(project.image_url);
	}

	return Project.findByIdAndUpdate(
		projectId,
		{ $set: projectData },
		{ new: true, runValidators: true }
	).populate(projectPopulate);
};

const deleteProject = async (projectId) => {
	const project = await Project.findById(projectId);

	if (!project) {
		throw new ApiError(
			404,
			"PROJECT_NOT_FOUND",
			"Проект не найден"
		);
	}

	await uploadService.deleteFile(project.image_url);
	await project.deleteOne();
};

const getFilters = async () => {
	const statuses = await ProjectStatus.find({ isActive: true }).sort({ order: 1 });

	const techIds = await Project.distinct("tech");

	const technologies = await Technology.aggregate([
		{ $match: { _id: { $in: techIds }, isActive: true } },
		{
			$lookup: {
				from: "technologycategories",
				localField: "category",
				foreignField: "_id",
				as: "category",
			},
		},
		{ $unwind: "$category" },
		{ $sort: { "category.order": 1, order: 1 } },
	]);

	return { statuses, technologies };
};

module.exports = {
	getProjects,
	getProjectsByAdmin,
	getProjectBySlug,
	getStatusOptions,
	createProject,
	updateProject,
	deleteProject,
	getFilters,
	getProjectById
};
