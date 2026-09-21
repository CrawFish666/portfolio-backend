const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");
const asyncHandler = require("../utils/asyncHandler");
const projectsService = require("../services/projects.service");

// ═══════════════════════════════════════════════════════════
// @desc    Получить список проектов (с фильтрами)
// @route   GET /api/projects
// @query   ?search=string&status=string&tech=string&favorite=true/false
// ═══════════════════════════════════════════════════════════
const getProjects = asyncHandler(async (req, res) => {
	const data = await projectsService.getProjects(req.query);

	sendSuccess(res, {
		message: "Проекты получены",
		data,
	});
});

const getProjectsByAdmin = asyncHandler(async (req, res) => {
	const data = await projectsService.getProjectsByAdmin(req.query);

	sendSuccess(res, {
		message: "Проекты получены",
		data,
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Получить доступные статусы
// @route   GET /api/projects/statuses
// ═══════════════════════════════════════════════════════════
const getStatusOptions = asyncHandler(async (req, res) => {
	const data = await projectsService.getStatusOptions();

	sendSuccess(res, {
		message: "Статусы проектов получены",
		data,
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Получить проект по slug
// @route   GET /api/projects/:slug
// ═══════════════════════════════════════════════════════════
const getProjectBySlug = asyncHandler(async (req, res) => {
	const project = await projectsService.getProjectBySlug(req.params.slug);

	if (!project) {
		throw new ApiError(
			404,
			"PROJECT_NOT_FOUND",
			"Проект не найден"
		);
	}

	sendSuccess(res, {
		message: "Проект получен",
		data: project,
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Получить проект по id
// @route   GET /api/projects/id
// ═══════════════════════════════════════════════════════════
const getProjectById = asyncHandler(async (req, res) => {
	const data = await projectsService.getProjectById(req.params.id);

	sendSuccess(res, {
		message: "Проект получен",
		data,
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Создать проект (админ)
// @route   POST /api/projects
// ═══════════════════════════════════════════════════════════
const createProject = asyncHandler(async (req, res) => {
	const data = await projectsService.createProject(req.body);

	sendSuccess(res, {
		status: 201,
		message: "Проект создан",
		data,
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Обновить проект (админ)
// @route   PUT /api/projects/:id
// ═══════════════════════════════════════════════════════════
const updateProject = asyncHandler(async (req, res) => {
	const data = await projectsService.updateProject(
		req.params.id,
		req.body
	);

	sendSuccess(res, {
		message: "Проект обновлён",
		data,
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Удалить проект (админ)
// @route   DELETE /api/projects/:id
// ═══════════════════════════════════════════════════════════
const deleteProject = asyncHandler(async (req, res) => {
	await projectsService.deleteProject(req.params.id);

	sendSuccess(res, {
		message: "Проект удалён",
		data: {
			id: req.params.id,
		},
	});
});

// ═══════════════════════════════════════════════════════════
// @desc    Получить фильтры проектов
// @route   GET /api/projects/filters
// ═══════════════════════════════════════════════════════════
const getFilters = asyncHandler(async (req, res) => {
	const data = await projectsService.getFilters();

	sendSuccess(res, {
		message: "Фильтры проектов получены",
		data,
	});
});

module.exports = {
	getProjects,
	getProjectsByAdmin,
	getStatusOptions,
	getProjectBySlug,
	createProject,
	updateProject,
	deleteProject,
	getFilters,
	getProjectById
};