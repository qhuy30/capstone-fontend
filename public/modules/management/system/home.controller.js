myApp.registerCtrl("system_home_controller", [
  "$scope",
  "$rootScope",
  "system_home_service",
  "fRoot",
  "$q",
  "$filter",
  function ($scope, $rootScope, system_home_service, fRoot, $q, $filter) {
    $rootScope.currentGroupMenu = "home";
    /**declare variable */
    const _statusValueSet = [
      { name: "Notify", action: "load" },
      { name: "Notify", action: "count" },
      { name: "Task", action: "load" },
      { name: "Notify", action: "like" },
      { name: "Notify", action: "unlike" },
    ];

    const ctrl = this;
    ctrl.tab = "all";
    ctrl._ctrlName = "system_home_controller";
    ctrl.notify = createNotifyObject();
    ctrl.bookmarkNotify = createNotifyObject();
    ctrl.task = { createdItems: [], assignedItems: [] };
    ctrl._searchByKeyToFilterData = "";
    ctrl._filterDepartment = "";
    ctrl._filterNewsType = ""
    ctrl._filterGroup = "";
    ctrl.dateEnd = new Date();
    ctrl._notyetInit = true;
    ctrl.isLoading = false;
    ctrl.noMoreData = false;
    ctrl.isImagePreviewVisible = false;
    ctrl.previewImageUrl = "";
    ctrl.isBookmarkActive = false;

    $rootScope.statusValue.generateSet(ctrl._ctrlName, _statusValueSet);

    ctrl.notify_group_config = {
      master_key: "notify_group",
      load_details_column: "value",
    };

    function createNotifyObject() {
      return {
        items: [],
        totalItems: 0,
        numOfItemPerPage: 10,
        offset: 0,
        sort: { name: "_id", value: false, query: { _id: -1, priority: -1 } },
        noMoreItems: false,
      };
    }

    function generateFilter() {
      const obj = {};
      if (ctrl._searchByKeyToFilterData)
        obj.search = angular.copy(ctrl._searchByKeyToFilterData);
      if (ctrl._filterDepartment){
        obj.filterDepartment = angular.copy(ctrl._filterDepartment)
      }
      if (ctrl.dateStart){
        obj.dateStart = $filter('convertToStartOfDay')(ctrl.dateStart).getTime();;
      }
      if (ctrl.dateEnd){
        obj.dateEnd = $filter('convertToEndOfDay')(ctrl.dateEnd).getTime();
      }
      if (ctrl._filterNewsType){
        obj._filterNewsType = angular.copy(ctrl._filterNewsType)
      }
      if (ctrl._filterGroup) obj.group = angular.copy(ctrl._filterGroup);
      return obj;
    }

    ctrl.switchTab = function (val) {
      if (ctrl.tab === val) return;
      ctrl.tab = val;

      if (ctrl.tab === "bookmark") {
        ctrl.isBookmarkActive = !ctrl.isBookmarkActive;
      } else {
        ctrl.isBookmarkActive = false;
      }
      ctrl.refreshData();
    };

    ctrl.previewImage = function (url) {
      ctrl.previewImageUrl = url;
      ctrl.isImagePreviewVisible = true;
      document.getElementById("previewImage").src = url;
    };

    ctrl.closeImagePreview = function () {
      ctrl.isImagePreviewVisible = false;
      ctrl.previewImageUrl = "";
    };

    function loadNotifyService() {
      return loadService(system_home_service.load_notify, ctrl.notify);
    }

    function loadBookmarkNotifyService() {
      return loadService(
        system_home_service.load_bookmark_notify,
        ctrl.bookmarkNotify
      );
    }

    function loadService(serviceFunction, notifyObject) {
      const dfd = $q.defer();
      const filter = generateFilter();
    
      serviceFunction(
        filter.search,
        filter.filterDepartment,
        notifyObject.numOfItemPerPage,
        notifyObject.offset,
        notifyObject.sort.query,
        filter.dateStart,
        filter.dateEnd,
        filter._filterNewsType
      )
        .then((res) => {
          if (res.data.length < notifyObject.numOfItemPerPage) {
            notifyObject.noMoreItems = true;
            ctrl.noMoreData = true;
          }
    
          const itemsWithAttachments = res.data.filter(item => item.attachments && item.attachments.length > 0);
          const loadFilePromises = itemsWithAttachments.map(item => {
            return $q.all(item.attachments.map(at => {
              if (['png', 'jpg', 'jpeg', 'gif'].includes(at.name.split('.').pop().toLowerCase())) {
                return system_home_service.load_file_info(item.code, at.name).then(fileInfor=> { 
                  at.fileInfo = fileInfor.data
                })
              }
            }));
          });
    
          $q.all(loadFilePromises).then(() => {
            notifyObject.items = notifyObject.items.concat(
              res.data.map((item) => {
                item.bookmarked = item.bookmark && item.bookmark.includes($rootScope.logininfo.username);
                item.liked = item.like && item.like.includes($rootScope.logininfo.username);
                item.attachments = item.attachments.map(at => {
                  if (['png', 'jpg', 'jpeg', 'gif'].includes(at.name.split('.').pop().toLowerCase())) {
                    at.isImage = true;
                  } else {
                    at.isImage = false;
                  }
                  
                  return at;
                });
                return item;
              })
            );
            dfd.resolve(true);
          });
        })
        .catch((err) => {
          console.error("Error loading notifications:", err);
          dfd.reject(false);
        })
        .finally(() => {
          ctrl.isLoading = false;
        });
    
      return dfd.promise;
    }

    ctrl.loadNotify = function (val) {
      if (val !== undefined) ctrl.notify.offset = angular.copy(val);
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Notify",
        "load",
        loadNotifyService
      );
    };

    ctrl.loadBookmarkNotify = function (val) {
      if (val !== undefined) ctrl.bookmarkNotify.offset = angular.copy(val);
      return $rootScope.statusValue.execute(
        ctrl._ctrlName,
        "Notify",
        "load",
        loadBookmarkNotifyService
      );
    };

    ctrl.toggleBookmark = function (item) {
      item.bookmarked = !item.bookmarked;
      if (item.bookmarked) {
        system_home_service.save_bookmark(item._id);
      } else {
        system_home_service.unsave_bookmark(item._id);
        ctrl.bookmarkNotify.items = ctrl.bookmarkNotify.items.filter(
          (i) => i._id !== item._id
        );
      }
    };

    ctrl.refreshData = function () {
      resetNotifyObject(ctrl.notify);
      resetNotifyObject(ctrl.bookmarkNotify);
      ctrl.isLoading = false;
      ctrl.noMoreData = false;

      switch (ctrl.tab) {
        case "all":
          ctrl.loadNotify();
          break;
        case "bookmark":
          ctrl.loadBookmarkNotify();
          break;

        default:
          ctrl.loadNotify();
          break;
      }
    };

    function resetNotifyObject(notifyObject) {
      notifyObject.offset = 0;
      notifyObject.noMoreItems = false;
      notifyObject.items = [];
    }

    ctrl.loadMore = function () {
      if (ctrl.isLoading) return;
      ctrl.isLoading = true;

      if (ctrl.tab === "all" && !ctrl.notify.noMoreItems) {
        ctrl.notify.offset += ctrl.notify.numOfItemPerPage;
        ctrl.loadNotify(ctrl.notify.offset);
      } else if (ctrl.tab === "bookmark" && !ctrl.bookmarkNotify.noMoreItems) {
        ctrl.bookmarkNotify.offset += ctrl.bookmarkNotify.numOfItemPerPage;
        ctrl.loadBookmarkNotify(ctrl.bookmarkNotify.offset);
      } else {
        ctrl.noMoreData = true;
      }
    };

    function init() {
      ctrl.loadNotify();
      ctrl._notyetInit = false;
    }

    ctrl.searchNotify = function ({ search } = {}) {
      ctrl._searchByKeyToFilterData = search;
      ctrl.refreshData();
    };

    ctrl.like = function (item) {
      item.liked = !item.liked;
      if (!item.liked) {
        item.like = item.like.filter(
          (username) => username !== $rootScope.logininfo.username
        );
        system_home_service.unlike(item._id);
      } else {
        item.like.push($rootScope.logininfo.username);
        system_home_service.like(item._id);
      }
    };

    ctrl.loadfile = function (params) {
      return function () {
        var dfd = $q.defer();
        system_home_service.load_file_info(params.code, params.name).then(
          function (res) {
            dfd.resolve({
              display: res.data.display,
              embedUrl: res.data.url,
              guid: res.data.guid,
            });
            res = undefined;
            dfd = undefined;
          },
          function (err) {}
        );
        return dfd.promise;
      };
    };


    ctrl.previewImage = function (index, item) {
      ctrl.currentImageIndex = index;
      ctrl.currentItemImage = item;
      ctrl.previewImageUrl = item.attachments[index].fileInfo.url;
      ctrl.isImagePreviewVisible = true;
      document.getElementById("previewImage").src = ctrl.previewImageUrl;
    };
    
    ctrl.closeImagePreview = function () {
      ctrl.isImagePreviewVisible = false;
      ctrl.previewImageUrl = "";
      ctrl.currentImageIndex = '';
      ctrl.currentItemImage = '';
    };
    
    ctrl.nextImage = function () {
      if (ctrl.currentImageIndex < ctrl.notify.items.length) {
        ctrl.currentImageIndex++;
        ctrl.previewImage(ctrl.currentImageIndex, ctrl.currentItemImage);
      }
    };
    
    ctrl.prevImage = function () {
      if (ctrl.currentImageIndex > 0) {
        ctrl.currentImageIndex--;
        ctrl.previewImage(ctrl.currentImageIndex, ctrl.currentItemImage);
      }
    };

    ctrl.toggleContent = function (item) {
      item.expanded = !item.expanded;
    };

    ctrl.applyFilters = function (val) {
      ctrl._filterDepartment = val ? val.id : null;
      ctrl.refreshData();
    }

    ctrl.on_pick_notify_group = function (param) {
      ctrl._filterNewsType = param.value;
      ctrl.refreshData();

    };

    ctrl.resetFilter = function () {
      ctrl._filterNewsType = "";
      ctrl._filterDepartment = null;
      ctrl.dateStart = null;
      ctrl.dateEnd = new Date();
      ctrl.refreshData();
    }

    init();
  },
]);
