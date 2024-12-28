package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use: "alice",
}

func init() {
	rootCmd.PersistentFlags().Bool("debug", false, "debug mode")
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		_, _ = os.Stderr.WriteString(err.Error() + "\n")
		os.Exit(1)
	}
}
