package main

import (
	"flag"
	"fmt"
	"os"
	"time"

	_ "embed"

	"context"
	"net/http"
	"regexp"

	"github.com/rs/cors"
	reports "github.com/uniiverse/api/gateway/reports/v1"

	"github.com/golang/glog"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var (
	// Command-line options:

	port                = os.Getenv("PORT")
	reportsGrpcEndpoint = os.Getenv("REPORTS_GRPC_ENDPOINT")
	allowedOriginRegex  = os.Getenv("CORS_REGEX")
	// Embedded Swagger/OpenAPI files:

	//go:embed reports/v1/reports_service.swagger.json
	reportsSwagger []byte
)

func init() {
	if port == "" {
		port = "8092"
	}

	if reportsGrpcEndpoint == "" {
		reportsGrpcEndpoint = "reports:50052"
	}

	if allowedOriginRegex == "" {
		allowedOriginRegex = "(http|https):\\/\\/(localhost(:\\d+)|uvrs.tech(:\\d+)|.*unii.rs|.*universe.com)"
	}
}

type RegisterServiceHandlerFunc func(ctx context.Context, mux *runtime.ServeMux, endpoint string, opts []grpc.DialOption) (err error)

func run() error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Register gRPC server endpoint
	// NOTE: Make sure the gRPC server is running properly and accessible.
	mux := runtime.NewServeMux()

	registerService(ctx, mux,
		reports.RegisterReportsServiceHandlerFromEndpoint,
		reportsGrpcEndpoint,
		"/reports/v1/swagger.json",
		reportsSwagger)

	originRegex, _ := regexp.Compile(allowedOriginRegex)

	withCors := cors.New(cors.Options{
		AllowOriginFunc: func(origin string) bool {
			allow := originRegex.MatchString(origin)
			fmt.Println("Origin: " + origin + ", allow: " + fmt.Sprint(allow))
			return allow
		},
		AllowedMethods:   []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"ACCEPT", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           int(30 * 24 * time.Hour),
	}).Handler(mux)

	// Start HTTP server (and proxy calls to gRPC server endpoint)
	fmt.Println("Listening on :" + port)
	return http.ListenAndServe(":"+port, withCors)
}

func registerService(
	context context.Context,
	mux *runtime.ServeMux,
	registerHandlerFunc RegisterServiceHandlerFunc,
	grpcServiceEndpoint string,
	swaggerFileName string,
	swaggerFileBytes []byte) error {
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}

	// Register the gRPC service handler.
	err := registerHandlerFunc(context, mux, grpcServiceEndpoint, opts)
	if err != nil {
		return err
	}

	// Handle Swagger requests and serve the Swagger file.
	err = mux.HandlePath(
		"GET",
		swaggerFileName,
		func(w http.ResponseWriter, r *http.Request, pathParams map[string]string) {
			w.Write(swaggerFileBytes)
		})
	if err != nil {
		return err
	}

	return err
}

func main() {
	fmt.Println("Starting" +
		"\n\tPORT: " + port +
		"\n\tREPORTS_GRPC_ENDPOINT: " + reportsGrpcEndpoint +
		"\n\tCORS_REGEX: " + allowedOriginRegex)

	flag.Parse()
	defer glog.Flush()

	if err := run(); err != nil {
		glog.Fatal(err)
	}
}
